import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import HeroSettingsClientManager from "./client";
import { isAdminAuthed } from "@/lib/admin/auth";
import { cloudinary } from "@/lib/cloudinary/server";

async function HeroSettingsContent() {
  const cookieStore = await cookies();
  if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
    redirect("/admin/login");
  }

  const supabase = createServerSupabase(true);
  const { data: heroSettings, error } = await supabase
    .from("hero_settings")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching hero settings:", error);
  }

  async function handleSave(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
      redirect("/admin/login");
    }
    const supabaseAdmin = createServerSupabase(true);
    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "").trim();
    const role = String(formData.get("role") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const cta_primary_label = String(formData.get("cta_primary_label") || "").trim();
    const cta_primary_href = String(formData.get("cta_primary_href") || "").trim();
    const cta_secondary_label = String(formData.get("cta_secondary_label") || "").trim();
    const cta_secondary_href = String(formData.get("cta_secondary_href") || "").trim();
    const image_url = String(formData.get("image_url") || "").trim();
    const image_public_id = String(formData.get("image_public_id") || "").trim();
    const available = formData.get("available") === "on";
    const available_text = String(formData.get("available_text") || "").trim();
    const published = formData.get("published") === "on";
    const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);

    const payload = {
      name: name || "Aditya Bachtiar",
      role: role || "Backend Developer & Robotics Engineer",
      description,
      cta_primary_label: cta_primary_label || "Lihat Karya",
      cta_primary_href: cta_primary_href || "#works",
      cta_secondary_label: cta_secondary_label || "Hubungi",
      cta_secondary_href: cta_secondary_href || "#contact",
      image_url: image_url || null,
      image_public_id: image_public_id || null,
      available,
      available_text: available_text || "Tersedia untuk bekerja",
      published,
      sort_order,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { data: existing } = await supabaseAdmin
        .from("hero_settings")
        .select("image_public_id")
        .eq("id", id)
        .single();
      const oldPublicId = existing?.image_public_id;
      if (oldPublicId && oldPublicId !== payload.image_public_id) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
        } catch (err) {
          console.error("Failed to delete old hero image from Cloudinary:", err);
        }
      }
      await supabaseAdmin.from("hero_settings").update(payload).eq("id", id);
    } else {
      await supabaseAdmin.from("hero_settings").insert([payload]);
    }

    revalidatePath("/admin/hero-settings");
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
      await supabaseAdmin.from("hero_settings").delete().eq("id", id);
      revalidatePath("/admin/hero-settings");
      revalidatePath("/");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-[#f5f5f7]">// HERO SETTINGS</h1>
          <p className="text-sm text-[#a1a1aa] mt-1">Kelola pengaturan Hero section (nama, peran, deskripsi, CTA, gambar).</p>
        </div>
        <Link href="/admin" className="text-xs font-mono bg-[#2a2a2a] px-3 py-2 text-[#f5f5f7] hover:bg-[#333]">
          &larr; Back to Dashboard
        </Link>
      </div>

      <HeroSettingsClientManager
        heroSettings={heroSettings || []}
        onSaveAction={handleSave}
        onDeleteAction={handleDelete}
      />
    </div>
  );
}

export default function AdminHeroSettingsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-[#a1a1aa]">Loading hero settings...</div>}>
      <HeroSettingsContent />
    </Suspense>
  );
}