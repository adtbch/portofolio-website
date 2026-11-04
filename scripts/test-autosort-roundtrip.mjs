// round-trip test: apply auto-sort to socials via the exact same update path, verify, restore
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n").filter(l => l.includes("=")).map(l => {
    const i = l.indexOf("=");
    return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
  })
);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const table = "socials";
const nameField = "platform";

const { data: before } = await supabase.from(table).select("id, platform, sort_order").order("sort_order");
console.log("BEFORE:", before.map(r => `${r.sort_order}:${r.platform}`).join(" | "));

const sorted = [...before].sort((a, b) => String(a[nameField]).localeCompare(String(b[nameField]), "id", { sensitivity: "base" }));
const results = await Promise.all(sorted.map((row, i) => supabase.from(table).update({ sort_order: i }).eq("id", row.id)));
const failed = results.filter(r => r.error);
console.log("UPDATE errors:", failed.length);

const { data: after } = await supabase.from(table).select("id, platform, sort_order").order("sort_order");
console.log("AFTER :", after.map(r => `${r.sort_order}:${r.platform}`).join(" | "));

const expect = sorted.map(r => r.id);
const got = after.map(r => r.id);
console.log("ORDER MATCHES SORT:", JSON.stringify(expect) === JSON.stringify(got));
console.log("SEQUENTIAL 0..n-1:", after.every((r, i) => r.sort_order === i));

// restore original values
await Promise.all(before.map(r => supabase.from(table).update({ sort_order: r.sort_order }).eq("id", r.id)));
const { data: restored } = await supabase.from(table).select("platform, sort_order").order("sort_order");
console.log("RESTORED:", restored.map(r => `${r.sort_order}:${r.platform}`).join(" | "));
