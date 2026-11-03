import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import CertificateClientManager from "./client";
import { isAdminAuthed } from "@/lib/admin/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function CertificatesContent() {
  const cookieStore = await cookies();
  if (!isAdminAuthed(cookieStore.get("admin_session")?.value)) {
    redirect("/admin/login");
  }

  const supabase = createServerSupabase(true);
  const { data: certificates, error } = await supabase
    .from("certificates")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching certificates:", error);
  }

  async function handleSave(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    if (!isAdminAuthed(cookieStore.get("admin_session")?.value)) {
      redirect("/admin/login");
    }
    const supabaseAdmin = createServerSupabase(true);
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const issuer = formData.get("issuer") as string;
    const issued_at = (formData.get("issued_at") as string) || null;
    const credential_url = (formData.get("credential_url") as string) || null;
    const image_url = (formData.get("image_url") as string) || null;
    const published = formData.get("published") === "on";
    const sort_order = parseInt((formData.get("sort_order") as string) || "0", 10);

    const certificate_public_id = String(formData.get("image_public_id") || "").trim();

    const payload = {
      title,
      issuer,
      issued_at: issued_at || null,
      credential_url: credential_url || null,
      image_url: image_url || null,
      image_public_id: certificate_public_id || null,
      sort_order,
      published,
    };

    if (id) {
      const { data: existing } = await supabaseAdmin
        .from("certificates")
        .select("image_public_id")
        .eq("id", id)
        .single();
      const oldPublicId = existing?.image_public_id;
      if (oldPublicId && oldPublicId !== payload.image_public_id) {
        try { await cloudinary.uploader.destroy(oldPublicId); } catch (err) { console.error("Failed to delete old certificate image:", err); }
      }
      await supabaseAdmin.from("certificates").update(payload).eq("id", id);
    } else {
      await supabaseAdmin.from("certificates").insert([payload]);
    }

    revalidatePath("/admin/certificates");
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
      await supabaseAdmin.from("certificates").delete().eq("id", id);
    }
    revalidatePath("/admin/certificates");
    revalidatePath("/");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold mb-2">Manage Certificates</h1>
          <p className="text-sm text-[#a1a1aa] font-mono">Add, edit, or remove certificates</p>
        </div>
        <Link href="/admin" className="text-xs font-mono text-[#a1a1aa] hover:text-[#22d3ee]">
          ← Back to Dashboard
        </Link>
      </div>
      <CertificateClientManager
        certificates={(certificates as any[]) || []}
        onSaveAction={handleSave}
        onDeleteAction={handleDelete}
      />
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 max-w-7xl mx-auto">
          <div className="h-8 bg-[#151515] rounded w-48 mb-8 animate-pulse"></div>
        </div>
      }
    >
      <CertificatesContent />
    </Suspense>
  );
}
