import { Suspense } from "react";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Experience from "@/components/sections/experience";
import FeaturedWorks from "@/components/sections/featured-works";
import Certificates from "@/components/sections/certificates";
import Contact from "@/components/sections/contact";


export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Suspense fallback={<div className="py-20 text-center font-mono text-xs text-[#a1a1aa]">Loading experiences...</div>}>
        <Experience />
      </Suspense>
      <Suspense fallback={<div className="py-20 text-center font-mono text-xs text-[#a1a1aa]">Loading featured works...</div>}>
        <FeaturedWorks />
      </Suspense>
      <Suspense fallback={<div className="py-20 text-center font-mono text-xs text-[#a1a1aa]">Loading certificates...</div>}>
        <Certificates />
      </Suspense>
      <Contact />
    </>
  );
}
