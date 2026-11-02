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
              Backend Developer & Robotics Engineer
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Lulusan Teknik Informatika Universitas Islam Sultan Agung dengan pengalaman dalam pengembangan perangkat lunak, backend, embedded system, dan robotika. Aktif dalam riset dan kompetisi robotika hingga tingkat nasional serta meraih Juara 2 kompetisi Web Development tingkat nasional.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Terbiasa menggunakan C/C++, Python, Golang, PHP, SQL, ESP32, dan berbagai teknologi pengembangan perangkat lunak. Memiliki pengalaman mengembangkan sistem elektronik dan pemrograman Automated Guided Vehicle (AGV), REST API menggunakan Golang, serta aplikasi berbasis web. Berbasis di Batang, Jawa Tengah, terbuka untuk kolaborasi proyek web, backend, dan IoT.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
