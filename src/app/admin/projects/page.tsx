import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import ProjectClientManager from "./client";
import { isAdminAuthed } from "@/lib/admin/auth";
import { cloudinary } from "@/lib/cloudinary/server";

async function ProjectsContent() {
  const cookieStore = await cookies();
  if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
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
    const cookieStore = await cookies();
    if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
      redirect("/admin/login");
    }
    const supabaseAdmin = createServerSupabase(true);
    const id = String(formData.get("id") || "");
    const title = String(formData.get("title") || "").trim();
    const rawSlug = String(formData.get("slug") || "").trim();
    const slug = rawSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const subtitle = String(formData.get("subtitle") || "").trim();
    const allowedCategories = ["web", "backend", "iot", "fullstack", "mobile"] as const;
    const requestedCategory = String(formData.get("category") || "web");
    const category = allowedCategories.includes(requestedCategory as (typeof allowedCategories)[number]) ? requestedCategory : "web";
    const description = String(formData.get("description") || "").trim();
    const live_url = String(formData.get("live_url") || "").trim();
    const repo_url = String(formData.get("repo_url") || "").trim();
    if (!title || title.length > 150 || !slug || slug.length > 150) return;
    const tech_stack_raw = String(formData.get("tech_stack") || "");
    const tech_stack = tech_stack_raw ? tech_stack_raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const images_raw = String(formData.get("images") || "");
    const images = images_raw
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && /^https?:\/\//i.test(u))
      .map((u) => ({ url: u }));
    const featured = formData.get("featured") === "on";
    const published = formData.get("published") === "on";
    const cover_public_id = String(formData.get("cover_public_id") || "").trim();
    const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);

    const payload = {
      title,
      slug,
      subtitle: subtitle || null,
      cover_image_url: String(formData.get("cover_image_url") || "").trim() || null,
      cover_public_id: cover_public_id || null,
      category,
      description: description || null,
      live_url: live_url || null,
      repo_url: repo_url || null,
      tech_stack,
      images,
      gallery: images.map((img) => img.url),
      featured,
      published,
      sort_order,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { data: existing } = await supabaseAdmin
        .from("projects")
        .select("cover_public_id")
        .eq("id", id)
        .single();
      const oldPublicId = existing?.cover_public_id;
      if (oldPublicId && oldPublicId !== payload.cover_public_id) {
        try { await cloudinary.uploader.destroy(oldPublicId); } catch (err) { console.error("Failed to delete old project cover:", err); }
      }
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
    const cookieStore = await cookies();
    if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
      redirect("/admin/login");
    }
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
