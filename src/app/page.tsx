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
  return <div className="py-20 text-center font-mono text-xs text-muted-foreground">Loading {label}...</div>;
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
      <AnimatedSection><HeroSection /></AnimatedSection>
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
