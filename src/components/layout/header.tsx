import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
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

        <nav className="hidden md:flex items-center gap-6">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="#contact"
            className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-mono font-medium text-accent-foreground bg-accent hover:opacity-90 transition-opacity"
          >
            Let's Talk
          </Link>
        </div>
      </Container>
    </header>
  );
}
