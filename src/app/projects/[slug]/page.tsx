import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { TechBadge } from "@/components/shared/tech-badge";
import { getProjectBySlug } from "@/lib/queries";
import { buildCoverUrl } from "@/lib/cloudinary/url";

// ponytail: dynamic route, no static params (DB may be empty). Blocking render is fine for a portfolio.
export const instant = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project tidak ditemukan" };

  const image = buildCoverUrl(project.cover_image_url);
  return {
    title: project.title,
    description: project.description ?? undefined,
    openGraph: {
      title: project.title,
      description: project.description ?? undefined,
      images: image.startsWith("http") ? [{ url: image }] : undefined,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const cover = buildCoverUrl(project.cover_image_url);
  const gallery = (project.gallery ?? []).map(buildCoverUrl);

  return (
    <article className="py-12 sm:py-16 lg:py-20">
      <Container className="flex flex-col gap-10">
        <Link
          href="/#works"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent"
        >
          &larr; Kembali
        </Link>

        <header className="flex flex-col gap-3">
          {project.category && (
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              {project.category}
            </span>
          )}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
              {project.subtitle}
            </p>
          )}
        </header>

        <div className="relative aspect-video w-full overflow-hidden border border-border bg-surface">
          <Image
            src={cover}
            alt={project.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
            className="object-cover"
          />
        </div>

        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <TechBadge key={tech} label={tech} />
            ))}
          </div>
        )}

        {(project.live_url || project.repo_url) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium border border-border bg-foreground text-background hover:opacity-90 transition-opacity"
              >
                Live Demo
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium border border-border text-foreground hover:border-accent hover:text-accent transition-colors"
              >
                Repository
              </a>
            )}
          </div>
        )}

        {project.description && (
          <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
            {project.description}
          </p>
        )}

        {project.challenge && (
          <section className="flex flex-col gap-3 max-w-3xl">
            <h2 className="font-heading text-xl font-semibold text-foreground">Tantangan</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {project.challenge}
            </p>
          </section>
        )}

        {project.solution && (
          <section className="flex flex-col gap-3 max-w-3xl">
            <h2 className="font-heading text-xl font-semibold text-foreground">Solusi</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {project.solution}
            </p>
          </section>
        )}

        {gallery.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="font-heading text-xl font-semibold text-foreground">Galeri</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {gallery.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="relative aspect-video w-full overflow-hidden border border-border bg-surface"
                >
                  <Image
                    src={src}
                    alt={`${project.title} — gambar ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}