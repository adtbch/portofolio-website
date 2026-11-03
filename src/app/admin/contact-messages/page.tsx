import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import ContactMessagesClientManager from "./client";
import { isAdminAuthed } from "@/lib/admin/auth";

async function ContactMessagesContent() {
  const cookieStore = await cookies();
  if (!isAdminAuthed(cookieStore.get("admin_session")?.value)) {
    redirect("/admin/login");
  }

  const supabase = createServerSupabase(true);
  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contact messages:", error);
  }

  async function handleUpdateStatus(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    if (!isAdminAuthed(cookieStore.get("admin_session")?.value)) {
      redirect("/admin/login");
    }
    const supabaseAdmin = createServerSupabase(true);
    const id = formData.get("id") as string;
    const status = formData.get("status") as "unread" | "read" | "archived";

    if (id && status) {
      await supabaseAdmin.from("contact_messages").update({ status }).eq("id", id);
      revalidatePath("/admin/contact-messages");
    }
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
      await supabaseAdmin.from("contact_messages").delete().eq("id", id);
      revalidatePath("/admin/contact-messages");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-[#f5f5f7]">// CONTACT MESSAGES</h1>
          <p className="text-sm text-[#a1a1aa] mt-1">Kelola pesan masuk dari formulir kontak.</p>
        </div>
        <Link href="/admin" className="text-xs font-mono bg-[#2a2a2a] px-3 py-2 text-[#f5f5f7] hover:bg-[#333]">
          &larr; Back to Dashboard
        </Link>
      </div>

      <ContactMessagesClientManager
        messages={messages || []}
        onUpdateStatusAction={handleUpdateStatus}
        onDeleteAction={handleDelete}
      />
    </div>
  );
}

export default function AdminContactMessagesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-[#a1a1aa]">Loading contact messages...</div>}>
      <ContactMessagesContent />
    </Suspense>
  );
}