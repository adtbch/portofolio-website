// src/components/sections/featured-works.tsx
import React, { useEffect, useState } from 'react';
import ProjectCard from '../shared/project-card';
// Assuming Project type is imported from '../types/index'
// import type { Project } from '../types'; // Adjust import path as needed
// Assuming getFeaturedProjects is imported from '../lib/queries'
// import { getFeaturedProjects } from '../lib/queries'; // Adjust import path as needed

// Define a mock Project type for demonstration purposes if not imported
type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  techStack?: string[];
  projectUrl?: string | null;
};

// Mock data for demonstration if getFeaturedProjects is not available directly
const mockFeaturedProjects: Project[] = [
  {
    id: 'proj-1',
    slug: 'awesome-project-1',
    title: 'Awesome Project One',
    description: 'This is a brief description of the first awesome project, highlighting its key features and impact.',
    imageUrl: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1678886400/projects/project1_cover.jpg', // Example Cloudinary URL
    techStack: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS'],
    projectUrl: 'https://example.com/live-demo-1',
  },
  {
    id: 'proj-2',
    slug: 'creative-app-2',
    title: 'Creative App Two',
    description: 'A look into the second creative application, showcasing innovative solutions and user experience design.',
    imageUrl: null, // Example of missing image
    techStack: ['Vue.js', 'Python', 'Django'],
    projectUrl: null,
  },
  {
    id: 'proj-3',
    slug: 'data-viz-3',
    title: 'Data Visualization Tool 3',
    description: 'Explore the third project, a powerful data visualization tool built for complex datasets.',
    imageUrl: 'v1678886400/projects/project3_cover.png', // Example relative Cloudinary path, assumes prefix is added in ProjectCard
    techStack: ['D3.js', 'React', 'GraphQL'],
    projectUrl: 'https://example.com/live-demo-3',
  },
];

// Placeholder for the actual data fetching function
const getFeaturedProjects = async (): Promise<Project[]> => {
  // In a real app, this would fetch data from your API or CMS
  // For now, returning mock data
  console.log('Fetching featured projects...');
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockFeaturedProjects;
};

const FeaturedWorks: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProjects = await getFeaturedProjects();
        setProjects(fetchedProjects);
      } catch (err: any) {
        console.error("Failed to fetch featured projects:", err);
        setError('Failed to load projects. Please try again later.');
        // TODO: Implement more robust error handling and logging for fetch failures.
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-600 dark:text-gray-300">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <section id="featured-works" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
          Featured Works
        </h2>
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2"> {/* Adjusted for better mobile/desktop split */}
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-600 dark:text-gray-300">
            No featured projects available at the moment.
            {/* TODO: Add a link to contact page or prompt to add projects */}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedWorks;
