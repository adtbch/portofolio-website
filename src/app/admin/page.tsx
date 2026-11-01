import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

async function DashboardContent() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (session?.value !== "authenticated") {
    redirect("/admin/login");
  }

  const supabase = createServerSupabase(true);

  // Fetch counts or basic stats
  const [projRes, expRes, skillRes] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("experiences").select("id", { count: "exact", head: true }),
    supabase.from("skills").select("id", { count: "exact", head: true }),
  ]);

  const projectCount = projRes.count ?? 0;
  const experienceCount = expRes.count ?? 0;
  const skillCount = skillRes.count ?? 0;

  const cards = [
    {
      title: "Projects",
      count: projectCount,
      desc: "Manage portfolio projects, tech stacks, GitHub links, and live URLs.",
      href: "/admin/projects",
    },
    {
      title: "Experiences",
      count: experienceCount,
      desc: "Manage work history, internships, roles, and descriptions.",
      href: "/admin/experiences",
    },
    {
      title: "Skills",
      count: skillCount,
      desc: "Manage tech stack items, grouping (languages, frameworks, etc.), and icons.",
      href: "/admin/skills",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight font-mono text-[#f5f5f7]">
          // DASHBOARD
        </h1>
        <p className="text-sm text-[#a1a1aa] mt-2">
          Selamat datang di panel kontrol portofolio. Pilih modul di bawah untuk mengelola konten database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-[#151515] border border-[#2a2a2a] p-6 hover:border-[#22d3ee] transition-all group block"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase text-[#22d3ee] tracking-wider">
                [{card.title}]
              </span>
              <span className="font-mono text-2xl font-bold text-[#f5f5f7] group-hover:text-[#22d3ee] transition-colors">
                {card.count}
              </span>
            </div>
            <p className="text-sm text-[#a1a1aa] leading-relaxed mb-6">
              {card.desc}
            </p>
            <div className="text-xs font-mono text-[#f5f5f7] group-hover:text-[#22d3ee] flex items-center">
              Kelola {card.title} &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-mono text-[#a1a1aa]">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
