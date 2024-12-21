// src/lib/services/projects.ts
import { Project } from "@/types/project";
import { prisma } from "@/lib/db";

export async function getProjects({
  category,
  search,
  status,
}: {
  category?: string;
  search?: string;
  status?: string;
} = {}): Promise<Project[]> {
  try {
    const where = {
      AND: [
        category ? { category } : {},
        status ? { status } : {},
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    };

    // const dbProjects = await prisma.project.findMany({
    //   where,
    //   orderBy: { createdAt: "desc" },
    //   select: {
    //     id: true,
    //     title: true,
    //     description: true,
    //     category: true,
    //     skills: true,
    //     status: true,
    //     likes: true,
    //     comments: true,
    //     collaborators: true,
    //     owner: {
    //       select: {
    //         name: true,
    //       },
    //     },
    //   },
    // });

    // // Transform the data to match our Project type
    // const projects: Project[] = dbProjects.map((project: Project) => ({
    //   id: project.id,
    //   title: project.title,
    //   description: project.description,
    //   category: project.category,
    //   skills: project.skills,
    //   owner: project.owner.name, // Convert owner object to string
    //   likes: project.likes,
    //   comments: project.comments,
    //   collaborators: project.collaborators,
    //   status: project.status as "Active" | "Completed" | "Planning",
    // }));
    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}
