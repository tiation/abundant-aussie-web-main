
import { ProjectCard } from "./ProjectCard";

interface ProjectsTabContentProps {
  projects: Array<{
    id: string;
    name: string;
    description: string;
    language: string;
    lastUpdated: string;
    status: string;
  }>;
}

export function ProjectsTabContent({ projects }: ProjectsTabContentProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
