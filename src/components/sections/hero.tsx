import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/container";
import { StatusBadge } from "@/components/shared/status-badge";

export default function Hero() {
  return (
    <section id="hero" className="py-16 sm:py-24 lg:py-32">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <StatusBadge
            available={siteConfig.status.available}
            text={siteConfig.status.text}
          />
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            {siteConfig.name}
          </h1>
          <p className="font-mono text-sm sm:text-base text-accent">
            {siteConfig.role}
          </p>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="#works"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium border border-border bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            Lihat Karya
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium border border-border text-foreground hover:bg-surface transition-colors"
          >
            Hubungi
          </Link>
        </div>
      </Container>
    </section>
  );
}
