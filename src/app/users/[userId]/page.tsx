import { Project } from "@/types/project";
import { getProjects } from "@/lib/services/projects";
import ProjectCard from "@/components/projects/ProjectCard";

type Params = Promise<{ userId: string }>;

export default async function UserPage({ params }: { params: Params }) {
  const { userId } = await params;
  const projects: Array<Project> = await getProjects({
    userId: parseInt(userId, 10),
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
