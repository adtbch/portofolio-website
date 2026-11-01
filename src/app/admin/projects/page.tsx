import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import ProjectClientManager from "./client";

async function ProjectsContent() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    redirect("/admin/login");
  }

  const supabase = createServerSupabase(true);
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  async function handleSave(formData: FormData) {
    "use server";
    const supabaseAdmin = createServerSupabase(true);
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const subtitle = formData.get("subtitle") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const live_url = formData.get("live_url") as string;
    const repo_url = formData.get("repo_url") as string;
    const tech_stack_raw = formData.get("tech_stack") as string;
    const tech_stack = tech_stack_raw ? tech_stack_raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const featured = formData.get("featured") === "on";
    const published = formData.get("published") === "on";
    const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      subtitle: subtitle || null,
      category: category || null,
      description: description || null,
      live_url: live_url || null,
      repo_url: repo_url || null,
      tech_stack,
      featured,
      published,
      sort_order,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      await supabaseAdmin.from("projects").update(payload).eq("id", id);
    } else {
      await supabaseAdmin.from("projects").insert([payload]);
    }

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const supabaseAdmin = createServerSupabase(true);
    const id = formData.get("id") as string;
    if (id) {
      await supabaseAdmin.from("projects").delete().eq("id", id);
      revalidatePath("/admin/projects");
      revalidatePath("/projects");
      revalidatePath("/");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-[#f5f5f7]">// PROJECTS MANAGEMENT</h1>
          <p className="text-sm text-[#a1a1aa] mt-1">Tambah, edit, atau hapus proyek portofolio.</p>
        </div>
        <Link href="/admin" className="text-xs font-mono bg-[#2a2a2a] px-3 py-2 text-[#f5f5f7] hover:bg-[#333]">
          &larr; Back to Dashboard
        </Link>
      </div>

      <ProjectClientManager
        projects={projects || []}
        onSaveAction={handleSave}
        onDeleteAction={handleDelete}
      />
    </div>
  );
}

export default function AdminProjectsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-[#a1a1aa]">Loading projects...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
