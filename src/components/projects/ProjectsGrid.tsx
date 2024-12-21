// src/components/projects/ProjectsGrid.tsx
import { Project } from "@/types/project";
import { getProjects } from "@/lib/services/projects";

import ProjectCard from "./ProjectCard";

interface ProjectsGridProps {
  searchParams?: {
    category?: string;
    search?: string;
    status?: string;
  };
}

export default async function ProjectsGrid({
  searchParams = {},
}: ProjectsGridProps) {
  const projects: Array<Project> = await getProjects({
    category: searchParams.category,
    search: searchParams.search,
    status: searchParams.status,
  });

  if (projects.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
