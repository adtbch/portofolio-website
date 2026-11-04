import { SectionLink } from "@/components/shared/section-link";
import { Container } from "@/components/layout/container";
import { StatusBadge } from "@/components/shared/status-badge";
import ProfileCard from "@/components/reactbits/ProfileCard";
import { TypewriterText } from "@/components/shared/typewriter-text";

interface HeroProps {
  name: string; role: string; description: string;
  cta_primary_label: string; cta_primary_href: string;
  cta_secondary_label: string; cta_secondary_href: string;
  image_url: string | null; available: boolean; available_text: string;
}

export default function Hero({ name, role, description, cta_primary_label, cta_primary_href, cta_secondary_label, cta_secondary_href, image_url, available, available_text }: HeroProps) {
  return (
    <section id="hero" className="min-h-[calc(100svh-4rem)] flex items-center py-10 sm:py-14 lg:py-0">
      <Container className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
        <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
          <div className="w-full max-w-[280px] sm:max-w-[340px]">
            {/* @ts-expect-error */}
            <ProfileCard
              avatarUrl={image_url || "/images/hero-profile.webp"}
              name={name}
              title={role}
              enableTilt={true}
              theme="dark"
            />
          </div>
        </div>
        <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
          <div className="flex flex-col gap-4">
            <StatusBadge available={available} text={available_text} />
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">{name}</h1>
            <p className="font-mono text-sm sm:text-base text-accent min-h-[1.5em]"><TypewriterText text={role} /></p>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">{description}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <SectionLink href={cta_primary_href} className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-sm font-medium border border-border bg-foreground text-background hover:opacity-90 transition-opacity">{cta_primary_label}</SectionLink>
            <SectionLink href={cta_secondary_href} className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-sm font-medium border border-border text-foreground hover:bg-surface transition-colors">{cta_secondary_label}</SectionLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
