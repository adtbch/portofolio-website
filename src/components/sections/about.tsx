import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading index="02" title="Tentang Saya" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-xl sm:text-2xl font-semibold text-foreground">
              Backend + Embedded
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Saya membangun API yang skalabel dengan Laravel dan Go, serta sistem embedded/IoT berbasis ESP32. Fokus pada efisiensi, kejelasan arsitektur, dan integrasi yang praktis.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Berbasis di Indonesia, terbuka untuk kolaborasi proyek web, backend, dan IoT.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
