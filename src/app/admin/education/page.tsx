import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import EducationClientManager from "./client";
import { isAdminAuthed } from "@/lib/admin/auth";

async function EducationContent() {
  const cookieStore = await cookies();
  if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
    redirect("/admin/login");
  }

  const supabase = createServerSupabase(true);
  const { data: education, error } = await supabase
    .from("education")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching education:", error);
  }

  async function handleSave(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
      redirect("/admin/login");
    }
    const supabaseAdmin = createServerSupabase(true);
    const id = String(formData.get("id") || "");
    const institution = String(formData.get("institution") || "").trim();
    const degree = String(formData.get("degree") || "").trim();
    const period = String(formData.get("period") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const gpa = String(formData.get("gpa") || "").trim();
    const published = formData.get("published") === "on";
    const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);

    if (!institution || !degree) {
      throw new Error("Institution and degree are required");
    }

    const payload = {
      institution,
      degree,
      period: period || null,
      description: description || null,
      gpa: gpa || null,
      published,
      sort_order,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      await supabaseAdmin.from("education").update(payload).eq("id", id);
    } else {
      await supabaseAdmin.from("education").insert([payload]);
    }

    revalidatePath("/admin/education");
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
      await supabaseAdmin.from("education").delete().eq("id", id);
      revalidatePath("/admin/education");
      revalidatePath("/");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-[#f5f5f7]">// EDUCATION MANAGEMENT</h1>
          <p className="text-sm text-[#a1a1aa] mt-1">Tambah, edit, atau hapus riwayat pendidikan.</p>
        </div>
        <Link href="/admin" className="text-xs font-mono bg-[#2a2a2a] px-3 py-2 text-[#f5f5f7] hover:bg-[#333]">
          &larr; Back to Dashboard
        </Link>
      </div>

      <EducationClientManager
        education={education || []}
        onSaveAction={handleSave}
        onDeleteAction={handleDelete}
      />
    </div>
  );
}

export default function AdminEducationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-[#a1a1aa]">Loading education...</div>}>
      <EducationContent />
    </Suspense>
  );
}