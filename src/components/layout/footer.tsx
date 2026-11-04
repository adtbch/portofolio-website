"use client";

import { usePathname } from "next/navigation";
import { siteConfig, socials } from "@/config/site";
import { Container } from "@/components/layout/container";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="w-full border-t border-border bg-background py-8 mt-auto">
      <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs font-mono text-muted-foreground text-center sm:text-left">
          <span>© {siteConfig.name}. Hak cipta dilindungi.</span>
          <span className="hidden sm:inline text-border">•</span>
          <span>Dibuat dengan Next.js & Tailwind CSS</span>
        </div>

        <div className="flex items-center gap-6">
          {socials
            .filter((s) => s.published)
            .map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-muted-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                {social.label || social.platform}
              </a>
            ))}
        </div>
      </Container>
    </footer>
  );
}
