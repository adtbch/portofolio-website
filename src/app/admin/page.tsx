import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { isAdminAuthed } from "@/lib/admin/auth";

async function DashboardContent() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!(await isAdminAuthed(session?.value))) {
    redirect("/admin/login");
  }

  const supabase = createServerSupabase(true);

  // Fetch counts or basic stats
  const [
    projRes,
    expRes,
    skillRes,
    certRes,
    eduRes,
    heroRes,
    aboutRes,
    socialRes,
    msgRes,
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("experiences").select("id", { count: "exact", head: true }),
    supabase.from("skills").select("id", { count: "exact", head: true }),
    supabase.from("certificates").select("id", { count: "exact", head: true }),
    supabase.from("education").select("id", { count: "exact", head: true }),
    supabase.from("hero_settings").select("id", { count: "exact", head: true }),
    supabase.from("about_settings").select("id", { count: "exact", head: true }),
    supabase.from("socials").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
  ]);

  const projectCount = projRes.count ?? 0;
  const experienceCount = expRes.count ?? 0;
  const skillCount = skillRes.count ?? 0;
  const certificateCount = certRes.count ?? 0;
  const educationCount = eduRes.count ?? 0;
  const heroCount = heroRes.count ?? 0;
  const aboutCount = aboutRes.count ?? 0;
  const socialCount = socialRes.count ?? 0;
  const messageCount = msgRes.count ?? 0;

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
    {
      title: "Certificates",
      count: certificateCount,
      desc: "Manage certifications, issuers, credentials, and images.",
      href: "/admin/certificates",
    },
    {
      title: "Education",
      count: educationCount,
      desc: "Manage academic history, degrees, institutions, and GPAs.",
      href: "/admin/education",
    },
    {
      title: "Hero Settings",
      count: heroCount,
      desc: "Manage hero section: name, role, description, CTAs, and image.",
      href: "/admin/hero-settings",
    },
    {
      title: "About Settings",
      count: aboutCount,
      desc: "Manage about section: heading, title, body paragraphs, and CTA.",
      href: "/admin/about-settings",
    },
    {
      title: "Social Links",
      count: socialCount,
      desc: "Manage social media links displayed in contact section.",
      href: "/admin/socials",
    },
    {
      title: "Site Settings",
      count: 0,
      desc: "Manage global site key-value settings.",
      href: "/admin/site-settings",
    },
    {
      title: "Contact Messages",
      count: messageCount,
      desc: "View and manage incoming contact form submissions.",
      href: "/admin/contact-messages",
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
