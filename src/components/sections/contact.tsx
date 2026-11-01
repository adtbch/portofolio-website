import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/layout/container";
import ContactForm from "@/components/forms/contact-form";
import { siteConfig } from "@/config/site";
import { socials } from "@/config/site";

export default function Contact() {
  const emailSocial = socials.find((s) => s.platform === "email");

  return (
    <section id="contact" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          index="05"
          title="Contact"
          description="Kirim pesan lewat form atau hubungi langsung."
        />
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Info
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tersedia untuk freelance/proyek. Balas dalam waktu wajar.
              </p>
            </div>
            {emailSocial?.url && (
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <a
                  href={emailSocial.url}
                  className="text-sm text-accent hover:underline"
                >
                  {emailSocial.url.replace("mailto:", "")}
                </a>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-foreground">Lokasi</p>
              <p className="text-sm text-muted-foreground">Indonesia • Remote friendly</p>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              TODO: Tambahkan info kontak resmi jika perlu.
            </p>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
