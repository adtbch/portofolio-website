import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/layout/container";
import Link from "next/link";
import { getExperiences } from "@/lib/queries";

export default async function Experience() {
  const experiences = await getExperiences();

  return (
    <section id="experience" className="py-16 sm:py-24">
      <Container>
        <SectionHeading index="03" title="Pengalaman" />
        {experiences.length === 0 ? (
          <div className="border border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Belum ada pengalaman yang ditampilkan.
            </p>
          </div>
        ) : (
          <ol className="relative border-l border-border ml-3 space-y-10">
            {experiences.map((exp) => (
              <li key={exp.id} className="ml-6">
                <span className="absolute -left-2.5 flex h-5 w-5 items-center justify-center bg-accent ring-8 ring-background" />
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {exp.company}
                      {exp.location ? ` • ${exp.location}` : ""}
                    </p>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {exp.start_date}
                    {exp.end_date ? ` — ${exp.end_date}` : " — Sekarang"}
                  </p>
                </div>
                {Array.isArray(exp.description) && exp.description.length > 0 && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    {exp.description.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
                {Array.isArray(exp.tech_stack) && exp.tech_stack.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs font-mono border border-border bg-surface text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {exp.projects && exp.projects.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-mono text-xs uppercase text-muted-foreground">Proyek Terkait</h4>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {exp.projects.map((proj) => (
                        <Link
                          key={proj.id}
                          href={`/projects/${proj.slug}`}
                          className="group bg-surface border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
                        >
                          <div className="aspect-video mb-3 overflow-hidden rounded bg-muted">
                            {proj.images && proj.images.length > 0 ? (
                              <img
                                src={proj.images[0].url}
                                alt={proj.images[0].alt || proj.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : proj.cover_image_url ? (
                              <img
                                src={proj.cover_image_url}
                                alt={proj.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : proj.gallery && proj.gallery.length > 0 ? (
                              <img
                                src={proj.gallery[0]}
                                alt={proj.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <h5 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-1">
                            {proj.title}
                          </h5>
                          {proj.subtitle && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{proj.subtitle}</p>
                          )}
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{proj.description}</p>
                          {(proj.tech_stack && proj.tech_stack.length > 0) && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {proj.tech_stack.slice(0, 4).map((tech) => (
                                <span key={tech} className="px-1.5 py-0.5 text-[10px] font-mono border border-border bg-surface text-muted-foreground">
                                  {tech}
                                </span>
                              ))}
                              {proj.tech_stack.length > 4 && (
                                <span className="px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/50">
                                  +{proj.tech_stack.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                          <span className="inline-flex items-center mt-3 text-xs font-mono text-accent hover:underline">
                            Lihat detail →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </Container>
    </section>
  );
}
