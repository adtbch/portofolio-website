import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import SkillClientManager from "./client";
import { isAdminAuthed } from "@/lib/admin/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function SkillsContent() {
  const cookieStore = await cookies();
  if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
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
    try {
      const cookieStore = await cookies();
      if (!(await isAdminAuthed(cookieStore.get("admin_session")?.value))) {
        redirect("/admin/login");
      }
      const supabaseAdmin = createServerSupabase(true);
      const id = String(formData.get("id") || "");
      const name = String(formData.get("name") || "").trim();
      const allowedGroups = ["languages", "frameworks", "databases", "tools", "embedded"] as const;
      const requestedGroup = String(formData.get("group") || "languages");
      const group = allowedGroups.includes(requestedGroup as (typeof allowedGroups)[number]) ? requestedGroup : "languages";
      const icon_url = String(formData.get("icon_url") || "").trim();
      const published = formData.get("published") === "on";
      const parsedSort = Number.parseInt(String(formData.get("sort_order") || "0"), 10);
      const sort_order = Number.isFinite(parsedSort) ? parsedSort : 0;

      if (!name || name.length > 80) {
        console.error("handleSave: invalid name", { nameLength: name.length });
        return;
      }

      const icon_public_id = String(formData.get("icon_public_id") || "").trim();

      const payload = {
        name,
        group,
        icon_url: icon_url || null,
        icon_public_id: icon_public_id || null,
        published,
        sort_order,
      };

      if (!payload.name) {
        console.error("handleSave: payload.name missing");
        return;
      }

      if (id) {
        const { data: existing, error: existingError } = await supabaseAdmin
          .from("skills")
          .select("icon_public_id")
          .eq("id", id)
          .single();
        if (existingError) {
          console.error("handleSave: error fetching existing skill", existingError);
        }
        const oldPublicId = existing?.icon_public_id;
        if (oldPublicId && oldPublicId !== payload.icon_public_id) {
          try {
            await cloudinary.uploader.destroy(oldPublicId);
          } catch (err) {
            console.error("Failed to delete old skill icon:", err);
          }
        }
        const { error: updateError } = await supabaseAdmin.from("skills").update(payload).eq("id", id);
        if (updateError) {
          console.error("handleSave: update error", updateError);
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabaseAdmin.from("skills").insert([payload]);
        if (insertError) {
          console.error("handleSave: insert error", insertError);
          throw insertError;
        }
      }

      revalidatePath("/admin/skills");
      revalidatePath("/");
    } catch (err) {
      console.error("handleSave: unexpected error", err);
      throw err;
    }
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
