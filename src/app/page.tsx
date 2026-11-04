import dynamic from "next/dynamic";
import { Suspense, type ReactNode } from "react";
import HeroSection from "@/components/sections/hero-section";
import About from "@/components/sections/about";
import { SectionWrapper } from "@/components/shared/section-wrapper";

const Education = dynamic(() => import("@/components/sections/education"));
const Experience = dynamic(() => import("@/components/sections/experience"));
const FeaturedWorks = dynamic(() => import("@/components/sections/featured-works"));
const Certificates = dynamic(() => import("@/components/sections/certificates"));
const Skills = dynamic(() => import("@/components/sections/skills"));
const Contact = dynamic(() => import("@/components/sections/contact"));

function SectionFallback({ label }: { label: string }) {
  return (
    <div className="py-16 sm:py-24" aria-busy="true" aria-label={`Memuat ${label}`}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-3 h-3 w-24 animate-pulse bg-border" />
        <div className="mb-8 h-8 w-64 animate-pulse bg-border" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="border border-border bg-surface p-6">
              <div className="mb-3 h-4 w-3/4 animate-pulse bg-border" />
              <div className="mb-2 h-3 w-1/2 animate-pulse bg-border" />
              <div className="h-3 w-2/3 animate-pulse bg-border" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimatedSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <SectionWrapper delay={delay}>{children}</SectionWrapper>;
}

function DatabaseSection({ children, label }: { children: ReactNode; label: string }) {
  return (
    <Suspense fallback={<SectionFallback label={label} />}>
      <AnimatedSection>{children}</AnimatedSection>
    </Suspense>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <AnimatedSection><About /></AnimatedSection>
      <DatabaseSection label="education"><Education /></DatabaseSection>
      <DatabaseSection label="experience"><Experience /></DatabaseSection>
      <DatabaseSection label="featured works"><FeaturedWorks /></DatabaseSection>
      <DatabaseSection label="prestasi"><Certificates /></DatabaseSection>
      <DatabaseSection label="skills"><Skills /></DatabaseSection>
      <Suspense fallback={<SectionFallback label="contact" />}>
        <AnimatedSection><Contact /></AnimatedSection>
      </Suspense>
    </>
  );
}
