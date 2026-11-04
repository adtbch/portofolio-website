"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { isAdminAuthed } from "@/lib/admin/auth";

type TableKey = "skills" | "certificates" | "education" | "experiences" | "projects" | "socials";

const TABLES: Record<
  TableKey,
  { nameField: string; groupField?: string; revalidate: string[] }
> = {
  skills: { nameField: "name", groupField: "group", revalidate: ["/admin/skills"] },
  certificates: { nameField: "title", revalidate: ["/admin/certificates"] },
  education: { nameField: "institution", revalidate: ["/admin/education"] },
  experiences: { nameField: "company", revalidate: ["/admin/experiences"] },
  projects: { nameField: "title", revalidate: ["/admin/projects"] },
  socials: { nameField: "platform", revalidate: ["/admin/socials"] },
};

const GROUP_ORDER = ["languages", "frameworks", "databases", "tools", "embedded"];

export async function autoSort(formData: FormData) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
    redirect("/admin/login");
  }

  const table = String(formData.get("table") || "") as TableKey;
  const config = TABLES[table];
  if (!config) {
    throw new Error(`autoSort: tabel tidak dikenal (${table})`);
  }

  const mode = String(formData.get("mode") || "name-asc");
  const supabase = createServerSupabase(true);

  const { data: rows, error } = await supabase.from(table).select("*");
  if (error) {
    console.error(`autoSort(${table}): fetch error`, error);
    throw new Error(`Gagal mengambil data ${table}: ${error.message}`);
  }
  if (!rows?.length) return;

  type Row = Record<string, unknown> & { id: string };
  const getName = (row: Row) => String(row[config.nameField] ?? "");

  const sorted = [...(rows as unknown as Row[])].sort((a, b) => {
    if (mode === "group" && config.groupField) {
      const ga = GROUP_ORDER.indexOf(String(a[config.groupField]));
      const gb = GROUP_ORDER.indexOf(String(b[config.groupField]));
      const na = ga === -1 ? GROUP_ORDER.length : ga;
      const nb = gb === -1 ? GROUP_ORDER.length : gb;
      if (na !== nb) return na - nb;
      return getName(a).localeCompare(getName(b), "id", { sensitivity: "base" });
    }
    if (mode === "name-desc") {
      return getName(b).localeCompare(getName(a), "id", { sensitivity: "base" });
    }
    return getName(a).localeCompare(getName(b), "id", { sensitivity: "base" });
  });

  const results = await Promise.all(
    sorted.map((row, index) =>
      supabase.from(table).update({ sort_order: index }).eq("id", row.id)
    )
  );

  const failed = results.filter((r) => r.error);
  if (failed.length) {
    console.error(`autoSort(${table}): update errors`, failed.map((f) => f.error));
    throw new Error(`Gagal update ${failed.length} baris di ${table}`);
  }

  config.revalidate.forEach((path) => revalidatePath(path));
  revalidatePath("/");
}
