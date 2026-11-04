import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/layout/container";
import { getCertificates } from "@/lib/queries";
import { TechBadge } from "@/components/shared/tech-badge";

export default async function Certificates() {
  const certs = await getCertificates();

  return (
    <section id="certificates" className="py-16 sm:py-24">
      <Container>
        <SectionHeading index="05" title="Prestasi & Sertifikasi" description="Sertifikat profesional dan pencapaian keahlian." />
        {certs.length === 0 ? (
          <div className="border border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Belum ada data prestasi/sertifikasi yang ditampilkan.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="group flex flex-col border border-border bg-surface overflow-hidden"
              >
                {cert.image_url && (
                  <a
                    href={cert.credential_url || cert.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-[4/3] overflow-hidden border-b border-border bg-black/20"
                  >
                    <img
                      src={cert.image_url}
                      alt={cert.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </a>
                )}
                <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-accent">{cert.issuer}</p>
                    {cert.issued_at && (
                      <span className="text-xs font-mono text-muted-foreground">
                        {cert.issued_at}
                      </span>
                    )}
                  </div>
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-mono text-accent hover:underline"
                    >
                      Lihat Kredensial &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}