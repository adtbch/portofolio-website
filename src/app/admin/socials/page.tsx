import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import SocialsClientManager from "./client";
import { isAdminAuthed } from "@/lib/admin/auth";

async function SocialsContent() {
  const cookieStore = await cookies();
  if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
    redirect("/admin/login");
  }

  const supabase = createServerSupabase(true);
  const { data: socials, error } = await supabase
    .from("socials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching socials:", error);
  }

  async function handleSave(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
      redirect("/admin/login");
    }
    const supabaseAdmin = createServerSupabase(true);
    const id = String(formData.get("id") || "");
    const platform = String(formData.get("platform") || "").trim();
    const label = String(formData.get("label") || "").trim();
    const url = String(formData.get("url") || "").trim();
    const published = formData.get("published") === "on";
    const sort_order = parseInt(formData.get("sort_order") as string || "0", 10);

    if (!platform || !url) {
      throw new Error("Platform and URL are required");
    }

    // Basic URL validation
    if (!/^https?:\/\//i.test(url)) {
      throw new Error("URL must start with http:// or https://");
    }

    const payload = {
      platform,
      label: label || null,
      url,
      published,
      sort_order,
    };

    if (id) {
      await supabaseAdmin.from("socials").update(payload).eq("id", id);
    } else {
      await supabaseAdmin.from("socials").insert([payload]);
    }

    revalidatePath("/admin/socials");
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
      await supabaseAdmin.from("socials").delete().eq("id", id);
      revalidatePath("/admin/socials");
      revalidatePath("/");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-[#f5f5f7]">// SOCIAL LINKS MANAGEMENT</h1>
          <p className="text-sm text-[#a1a1aa] mt-1">Kelola tautan sosial media yang ditampilkan di bagian Contact.</p>
        </div>
        <Link href="/admin" className="text-xs font-mono bg-[#2a2a2a] px-3 py-2 text-[#f5f5f7] hover:bg-[#333]">
          &larr; Back to Dashboard
        </Link>
      </div>

      <SocialsClientManager
        socials={socials || []}
        onSaveAction={handleSave}
        onDeleteAction={handleDelete}
      />
    </div>
  );
}

export default function AdminSocialsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-[#a1a1aa]">Loading socials...</div>}>
      <SocialsContent />
    </Suspense>
  );
}