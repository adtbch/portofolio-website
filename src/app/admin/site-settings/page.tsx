import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import SiteSettingsClientManager from "./client";
import { isAdminAuthed } from "@/lib/admin/auth";

async function SiteSettingsContent() {
  const cookieStore = await cookies();
  if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
    redirect("/admin/login");
  }

  const supabase = createServerSupabase(true);
  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("key, value, updated_at")
    .order("key", { ascending: true });

  if (error) {
    console.error("Error fetching site settings:", error);
  }

  async function handleSave(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
      redirect("/admin/login");
    }
    const supabaseAdmin = createServerSupabase(true);
    const key = String(formData.get("key") || "").trim();
    const value = String(formData.get("value") || "").trim();

    if (!key) {
      throw new Error("Key is required");
    }

    const payload = {
      key,
      value,
      updated_at: new Date().toISOString(),
    };

    await supabaseAdmin.from("site_settings").upsert([payload]);

    revalidatePath("/admin/site-settings");
    revalidatePath("/");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
      redirect("/admin/login");
    }
    const supabaseAdmin = createServerSupabase(true);
    const key = formData.get("key") as string;
    if (key) {
      await supabaseAdmin.from("site_settings").delete().eq("key", key);
      revalidatePath("/admin/site-settings");
      revalidatePath("/");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-[#f5f5f7]">// SITE SETTINGS</h1>
          <p className="text-sm text-[#a1a1aa] mt-1">Kelola pengaturan global situs (key-value pairs).</p>
        </div>
        <Link href="/admin" className="text-xs font-mono bg-[#2a2a2a] px-3 py-2 text-[#f5f5f7] hover:bg-[#333]">
          &larr; Back to Dashboard
        </Link>
      </div>

      <SiteSettingsClientManager
        settings={settings || []}
        onSaveAction={handleSave}
        onDeleteAction={handleDelete}
      />
    </div>
  );
}

export default function AdminSiteSettingsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-[#a1a1aa]">Loading site settings...</div>}>
      <SiteSettingsContent />
    </Suspense>
  );
}