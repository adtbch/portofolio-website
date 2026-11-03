import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import ExperienceClientManager from "./client";
import { isAdminAuthed } from "@/lib/admin/auth";
import type { Project } from "@/types";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function ExperiencesContent() {
  const cookieStore = await cookies();
  if (!isAdminAuthed(cookieStore.get("admin_session")?.value)) {
    redirect("/admin/login");
  }

  const supabase = createServerSupabase(true);
  const { data: experiences, error } = await supabase
    .from("experiences")
    .select("*, projects:projects(id, title, slug)")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching experiences:", error);
  }

  // Fetch all projects for linking
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, slug")
    .order("sort_order", { ascending: true });

  type ProjectMinimal = Pick<Project, "id" | "title" | "slug">;

  async function handleSave(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    if (!isAdminAuthed(cookieStore.get("admin_session")?.value)) {
      redirect("/admin/login");
    }
    const supabaseAdmin = createServerSupabase(true);
    const id = formData.get("id") as string;
    const company = formData.get("company") as string;
    const role = formData.get("role") as string;
    const logo_url = formData.get("logo_url") as string;
    const logo_public_id = String(formData.get("logo_public_id") || "").trim();
    const type = formData.get("type") as string;
    const location = formData.get("location") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const desc_raw = formData.get("description") as string;
    const description = desc_raw ? desc_raw.split("\n").map((s) => s.trim()).filter(Boolean) : [];
    const tech_stack_raw = formData.get("tech_stack") as string;
    const tech_stack = tech_stack_raw ? tech_stack_raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const published = formData.get("published") === "on";
    const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);
    const project_ids = formData.getAll("project_ids") as string[];

    const payload = {
      company,
      role,
      logo_url: logo_url || null,
      logo_public_id: logo_public_id || null,
      type: type || null,
      location: location || null,
      start_date,
      end_date: end_date || null,
      description,
      tech_stack,
      published,
      sort_order,
    };

    if (id) {
      const { data: existing } = await supabaseAdmin
        .from("experiences")
        .select("logo_public_id")
        .eq("id", id)
        .single();
      const oldPublicId = existing?.logo_public_id;
      if (oldPublicId && oldPublicId !== payload.logo_public_id) {
        try { await cloudinary.uploader.destroy(oldPublicId); } catch (err) { console.error("Failed to delete old experience logo:", err); }
      }
      await supabaseAdmin.from("experiences").update(payload).eq("id", id);
      // Update project links
      await supabaseAdmin
        .from("projects")
        .update({ experience_id: null })
        .eq("experience_id", id);
      if (project_ids.length > 0) {
        await supabaseAdmin
          .from("projects")
          .update({ experience_id: id })
          .in("id", project_ids);
      }
    } else {
      const { data: newExp } = await supabaseAdmin
        .from("experiences")
        .insert([payload])
        .select("id")
        .single();
      if (newExp?.id && project_ids.length > 0) {
        await supabaseAdmin
          .from("projects")
          .update({ experience_id: newExp.id })
          .in("id", project_ids);
      }
    }

    revalidatePath("/admin/experiences");
    revalidatePath("/");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    if (!isAdminAuthed(cookieStore.get("admin_session")?.value)) {
      redirect("/admin/login");
    }
    const supabaseAdmin = createServerSupabase(true);
    const id = formData.get("id") as string;
    if (id) {
      await supabaseAdmin.from("experiences").delete().eq("id", id);
      revalidatePath("/admin/experiences");
      revalidatePath("/");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-[#f5f5f7]">// EXPERIENCES MANAGEMENT</h1>
          <p className="text-sm text-[#a1a1aa] mt-1">Tambah, edit, atau hapus riwayat kerja dan pengalaman.</p>
        </div>
        <Link href="/admin" className="text-xs font-mono bg-[#2a2a2a] px-3 py-2 text-[#f5f5f7] hover:bg-[#333]">
          &larr; Back to Dashboard
        </Link>
      </div>

      <ExperienceClientManager
        experiences={experiences || []}
        projects={projects as ProjectMinimal[]}
        onSaveAction={handleSave}
        onDeleteAction={handleDelete}
      />
    </div>
  );
}

export default function AdminExperiencesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-[#a1a1aa]">Loading experiences...</div>}>
      <ExperiencesContent />
    </Suspense>
  );
}
