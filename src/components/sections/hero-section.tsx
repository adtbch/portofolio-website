import { Suspense } from "react";
import { getHeroSettings } from "@/lib/queries";
import Hero from "@/components/sections/hero";

async function HeroData() {
  const settings = await getHeroSettings();

  const fallback = {
    name: "Aditya Bachtiar",
    role: "Backend Developer, Fullstack Developer, Embedded Systems & Robotics Engineer",
    description: "Lulusan Teknik Informatika yang membangun backend, aplikasi web, sistem embedded, dan robotika. Berpengalaman dengan Golang, PHP, C/C++, Python, SQL, ESP32, serta pengembangan REST API dan Automated Guided Vehicle (AGV).",
    cta_primary_label: "Lihat Karya",
    cta_primary_href: "#works",
    cta_secondary_label: "Hubungi",
    cta_secondary_href: "#contact",
    image_url: null,
    available: true,
    available_text: "Tersedia untuk bekerja",
  };

  const data = settings || fallback;

  return (
    <Hero
      name={data.name}
      role={data.role}
      description={data.description}
      cta_primary_label={data.cta_primary_label}
      cta_primary_href={data.cta_primary_href}
      cta_secondary_label={data.cta_secondary_label}
      cta_secondary_href={data.cta_secondary_href}
      image_url={data.image_url}
      available={data.available}
      available_text={data.available_text}
    />
  );
}

export default function HeroSection() {
  return (
    <Suspense fallback={
      <section id="hero" className="py-12 sm:py-20 lg:py-32">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>
      </section>
    }>
      <HeroData />
    </Suspense>
  );
}