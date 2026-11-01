"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/experiences", label: "Experiences" },
    { href: "/admin/skills", label: "Skills" },
  ];

  return (
    <nav className="hidden md:flex space-x-4 text-xs font-mono">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`transition-colors ${
              active ? "text-[#22d3ee] font-bold" : "text-[#a1a1aa] hover:text-[#f5f5f7]"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/auth", { method: "DELETE" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="bg-[#2a2a2a] text-[#f5f5f7] px-3 py-1.5 text-xs font-mono hover:bg-red-950 hover:text-red-300 transition-colors"
    >
      Logout
    </button>
  );
}
