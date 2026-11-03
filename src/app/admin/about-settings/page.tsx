import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import AboutSettingsClientManager from "./client";
import { isAdminAuthed } from "@/lib/admin/auth";

async function AboutSettingsContent() {
  const cookieStore = await cookies();
  if (!isAdminAuthed(cookieStore.get("admin_session")?.value)) {
    redirect("/admin/login");
  }

  const supabase = createServerSupabase(true);
  const { data: aboutSettings, error } = await supabase
    .from("about_settings")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching about settings:", error);
  }

  async function handleSave(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    if (!isAdminAuthed(cookieStore.get("admin_session")?.value)) {
      redirect("/admin/login");
    }
    const supabaseAdmin = createServerSupabase(true);
    const id = String(formData.get("id") || "");
    const heading = String(formData.get("heading") || "").trim();
    const title = String(formData.get("title") || "").trim();
    const body_left = String(formData.get("body_left") || "").trim();
    const body_right = String(formData.get("body_right") || "").trim();
    const cta_label = String(formData.get("cta_label") || "").trim();
    const cta_href = String(formData.get("cta_href") || "").trim();

    const payload = {
      heading: heading || "Tentang Saya",
      title: title || "Backend Developer & Robotics Engineer",
      body_left,
      body_right,
      cta_label: cta_label || null,
      cta_href: cta_href || null,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      await supabaseAdmin.from("about_settings").update(payload).eq("id", id);
    } else {
      await supabaseAdmin.from("about_settings").insert([payload]);
    }

    revalidatePath("/admin/about-settings");
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
      await supabaseAdmin.from("about_settings").delete().eq("id", id);
      revalidatePath("/admin/about-settings");
      revalidatePath("/");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-[#f5f5f7]">// ABOUT SETTINGS</h1>
          <p className="text-sm text-[#a1a1aa] mt-1">Kelola pengaturan About section (heading, title, deskripsi kiri/kanan, CTA).</p>
        </div>
        <Link href="/admin" className="text-xs font-mono bg-[#2a2a2a] px-3 py-2 text-[#f5f5f7] hover:bg-[#333]">
          &larr; Back to Dashboard
        </Link>
      </div>

      <AboutSettingsClientManager
        aboutSettings={aboutSettings || []}
        onSaveAction={handleSave}
        onDeleteAction={handleDelete}
      />
    </div>
  );
}

export default function AdminAboutSettingsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-[#a1a1aa]">Loading about settings...</div>}>
      <AboutSettingsContent />
    </Suspense>
  );
}