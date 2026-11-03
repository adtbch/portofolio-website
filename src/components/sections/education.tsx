import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/layout/container";
import { getEducation } from "@/lib/queries";

export default async function Education() {
  const education = await getEducation();

  return (
    <section id="education" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          index="02"
          title="Pendidikan"
          description="Riwayat akademik dan gelar yang diperoleh."
        />
        {education.length === 0 ? (
          <div className="border border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Belum ada data pendidikan yang ditampilkan.
            </p>
          </div>
        ) : (
          <ol className="relative border-l border-border ml-3 space-y-10">
            {education.map((edu) => (
              <li key={edu.id} className="ml-6">
                <span className="absolute -left-2.5 flex h-5 w-5 items-center justify-center bg-accent ring-8 ring-background" />
                <div className="space-y-2">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="font-mono text-xs text-muted-foreground">
                      {edu.period}
                    </p>
                    {edu.gpa && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-mono font-medium text-accent">
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                  {edu.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </section>
  );
}