import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Skills from "@/components/sections/skills";
import Experience from "@/components/sections/experience";
import FeaturedWorks from "@/components/sections/featured-works";
import Certificates from "@/components/sections/certificates";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <FeaturedWorks />
      <Certificates />
      <Contact />
    </>
  );
}
