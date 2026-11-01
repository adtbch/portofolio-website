import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import ProjectCard from "@/components/shared/project-card";
import { getFeaturedProjects } from "@/lib/queries";

export default async function FeaturedWorks() {
  const projects = await getFeaturedProjects();

  return (
    <section id="works" className="py-12 sm:py-16 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading index="03" title="Karya Unggulan" />
        {projects.length === 0 ? (
          <div className="border border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {/* TODO: Tambahkan project ke database (projects table, featured=true) agar tampil di sini. */}
              Belum ada project unggulan tersedia.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}