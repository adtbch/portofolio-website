import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/layout/container";
import { getExperiences } from "@/lib/queries";

export default async function Experience() {
  const experiences = await getExperiences();

  return (
    <section id="experience" className="py-16 sm:py-24">
      <Container>
        <SectionHeading index="04" title="Pengalaman" />
        {experiences.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada pengalaman yang ditampilkan. TODO: Tambahkan data pengalaman di Supabase.
          </p>
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
              </li>
            ))}
          </ol>
        )}
      </Container>
    </section>
  );
}
