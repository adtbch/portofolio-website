import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { AdminNav, LogoutButton } from "./components";
import { isAdminAuthed } from "@/lib/admin/auth";

async function AdminHeader() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const isAuthenticated = isAdminAuthed(session?.value);

  if (!isAuthenticated) return null;

  return (
    <header className="border-b border-[#2a2a2a] bg-[#151515] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Link href="/admin" className="font-mono font-bold text-[#22d3ee] tracking-wider text-sm">
          // ADMIN.PANEL
        </Link>
        <AdminNav />
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[#a1a1aa] hover:text-[#22d3ee] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#22d3ee] focus-visible:rounded-sm">
          View Site ↗
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f5f5f7] flex flex-col">
      <Suspense fallback={<div className="h-16 bg-[#151515] border-b border-[#2a2a2a]" />}>
        <AdminHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
    </div>
  );
}
