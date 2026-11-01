import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import SkillClientManager from "./client";

async function SkillsContent() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    redirect("/admin/login");
  }

  const supabase = createServerSupabase(true);
  const { data: skills, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching skills:", error);
  }

  async function handleSave(formData: FormData) {
    "use server";
    const supabaseAdmin = createServerSupabase(true);
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const group = formData.get("group") as string;
    const icon_url = formData.get("icon_url") as string;
    const published = formData.get("published") === "on";
    const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);

    const payload = {
      name,
      group: group || "languages",
      icon_url: icon_url || null,
      published,
      sort_order,
    };

    if (id) {
      await supabaseAdmin.from("skills").update(payload).eq("id", id);
    } else {
      await supabaseAdmin.from("skills").insert([payload]);
    }

    revalidatePath("/admin/skills");
    revalidatePath("/");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const supabaseAdmin = createServerSupabase(true);
    const id = formData.get("id") as string;
    if (id) {
      await supabaseAdmin.from("skills").delete().eq("id", id);
      revalidatePath("/admin/skills");
      revalidatePath("/");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-[#f5f5f7]">// SKILLS MANAGEMENT</h1>
          <p className="text-sm text-[#a1a1aa] mt-1">Tambah, edit, atau hapus keterampilan dan teknologi.</p>
        </div>
        <Link href="/admin" className="text-xs font-mono bg-[#2a2a2a] px-3 py-2 text-[#f5f5f7] hover:bg-[#333]">
          &larr; Back to Dashboard
        </Link>
      </div>

      <SkillClientManager
        skills={skills || []}
        onSaveAction={handleSave}
        onDeleteAction={handleDelete}
      />
    </div>
  );
}

export default function AdminSkillsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-[#a1a1aa]">Loading skills...</div>}>
      <SkillsContent />
    </Suspense>
  );
}
