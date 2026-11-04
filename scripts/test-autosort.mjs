// mirrors src/lib/admin/auto-sort.ts logic, run against real DB
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n").filter(l => l.includes("=")).map(l => {
    const i = l.indexOf("=");
    return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
  })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

const GROUP_ORDER = ["languages", "frameworks", "databases", "tools", "embedded"];

const TABLES = {
  skills: { nameField: "name", groupField: "group" },
  certificates: { nameField: "title" },
  education: { nameField: "institution" },
  experiences: { nameField: "company" },
  projects: { nameField: "title" },
  socials: { nameField: "platform" },
};

function sortRows(rows, cfg, mode) {
  const getName = r => String(r[cfg.nameField] ?? "");
  return [...rows].sort((a, b) => {
    if (mode === "group" && cfg.groupField) {
      const ga = GROUP_ORDER.indexOf(String(a[cfg.groupField]));
      const gb = GROUP_ORDER.indexOf(String(b[cfg.groupField]));
      const na = ga === -1 ? GROUP_ORDER.length : ga;
      const nb = gb === -1 ? GROUP_ORDER.length : gb;
      if (na !== nb) return na - nb;
      return getName(a).localeCompare(getName(b), "id", { sensitivity: "base" });
    }
    if (mode === "name-desc") return getName(b).localeCompare(getName(a), "id", { sensitivity: "base" });
    return getName(a).localeCompare(getName(b), "id", { sensitivity: "base" });
  });
}

for (const [table, cfg] of Object.entries(TABLES)) {
  const { data: rows, error } = await supabase.from(table).select("*");
  if (error) { console.log(`${table}: FETCH ERROR`, error.message); continue; }
  if (!rows?.length) { console.log(`${table}: 0 rows`); continue; }

  for (const mode of ["name-asc", "name-desc", ...(cfg.groupField ? ["group"] : [])]) {
    const sorted = sortRows(rows, cfg, mode);
    const orders = sorted.map((_, i) => i);
    const ok = orders.length === rows.length && new Set(orders).size === rows.length;
    console.log(`${table.padEnd(13)} ${mode.padEnd(10)} rows=${rows.length} unique=${new Set(orders).size} ${ok ? "OK" : "FAIL"}`);
    console.log(`   first3: ${sorted.slice(0, 3).map(r => `${r[cfg.nameField]}${cfg.groupField ? "[" + r[cfg.groupField] + "]" : ""}`).join(" | ")}`);
  }
}
