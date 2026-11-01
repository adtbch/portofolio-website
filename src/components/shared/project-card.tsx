// src/components/shared/project-card.tsx
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// Assuming Project type is imported from '../types/index'
// import type { Project } from '../types'; // Adjust import path as needed

interface ProjectCardProps {
  project: {
    id: string;
    slug: string;
    title: string;
    description: string;
    imageUrl?: string | null; // Optional image URL
    techStack?: string[]; // Optional array of tech stack names
    projectUrl?: string | null; // Optional external project link
  };
}

// Placeholder for a locally hosted fallback image
const fallbackCover = '/images/fallback-project-cover.jpg';

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Determine the image source
  let imageSrc = fallbackCover;
  if (project.imageUrl) {
    if (project.imageUrl.startsWith('/images/')) {
      // Local path
      imageSrc = project.imageUrl;
    } else if (project.imageUrl.startsWith('http') || project.imageUrl.startsWith('//')) {
      // Absolute URL (e.g., from another CDN or direct upload)
      imageSrc = project.imageUrl;
    } else {
      // Assume it's a Cloudinary path that needs prefixing
      // TODO: Replace 'your-cloud-name' with actual Cloudinary cloud name
      imageSrc = `https://res.cloudinary.com/your-cloud-name/image/upload/${project.imageUrl}`;
    }
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-110"
            // The \`onError\` handler in \`next/image\` isn\'t directly used to switch sources,
            // but the \`fallbackCover\` logic above should handle missing images.
            // For a more dynamic fallback, one might use \`useEffect\` and \`useState\`.
          />
          {/* Ensure fallback is rendered if imageUrl is null/empty and not a valid src */}
          {!project.imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <Image
                      src={fallbackCover}
                      alt="Fallback Project Cover"
                      layout="fill"
                      objectFit="contain"
                  />
              </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          <Link href={`/projects/${project.slug}`} className="hover:underline">
            {project.title}
          </Link>
        </h3>
        <p className="mb-3 text-gray-600 dark:text-gray-300">{project.description}</p>

        <div className="mb-3 flex flex-wrap gap-2">
          {project.techStack?.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            >
              {tech}
            </span>
          ))}
          {project.techStack && project.techStack.length > 3 && (
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              +{project.techStack.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Read More &rarr;
          </Link>
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gray-700 hover:underline dark:text-gray-300"
              aria-label={`Live demo of ${project.title}`} // Accessibility improvement
            >
              Live Demo &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
