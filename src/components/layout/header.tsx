"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/container";

export function Header() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:rounded-sm"
          >
            <span className="font-heading font-bold text-lg tracking-tight text-foreground group-hover:text-accent transition-colors">
              {siteConfig.shortName}
            </span>
            <span className="text-muted-foreground font-mono text-xs hidden sm:inline-block">
              // dev
            </span>
          </Link>

          {siteConfig.status.available && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 text-xs font-mono text-muted-foreground bg-surface border border-border">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{siteConfig.status.text}</span>
            </div>
          )}
        </div>

        <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-6">
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:rounded-sm"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/admin"
                  className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:rounded-sm"
                >
                  Admin Panel
                </Link>
              </nav>

        <div className="flex items-center gap-4">
          <Link
            href="#contact"
            className="md:hidden inline-flex items-center justify-center min-h-[48px] px-3 py-1 text-xs font-mono font-medium text-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            Kontak
          </Link>
        </div>
      </Container>
    </header>
  );
}
