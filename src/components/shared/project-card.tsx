import Image from "next/image";
import Link from "next/link";
import { TechBadge } from "@/components/shared/tech-badge";
import { buildCoverUrl } from "@/lib/cloudinary/url";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const imageSrc = buildCoverUrl(project.cover_image_url);

  return (
    <div className="group relative flex flex-col overflow-hidden border border-border bg-surface transition-all duration-300 hover:shadow-none">
      <Link href={`/projects/${project.slug}`} className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {project.tech_stack.slice(0, 5).map((tech) => (
                <TechBadge key={tech} label={tech} />
              ))}
              {project.tech_stack.length > 5 && (
                              <TechBadge label={`+${project.tech_stack.length - 5}`} className="text-muted-foreground border-muted" />
                            )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}