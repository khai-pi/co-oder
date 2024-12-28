import { Prisma } from "@prisma/client";

import { Project } from "@/types/project";
import { prisma } from "@/lib/prisma";

export async function getProjects({
  category,
  search,
  status,
  userId,
}: {
  category?: string;
  search?: string;
  status?: string;
  userId?: number;
} = {}): Promise<Project[]> {
  try {
    const where: Prisma.ProjectWhereInput = {
      AND: [
        ...(userId ? [{ ownerId: userId }] : []),
        ...(category ? [{ category }] : []),
        ...(status ? [{ status }] : []),
        ...(search
          ? [
              {
                OR: [
                  {
                    title: {
                      contains: search,
                      mode: "insensitive",
                    } as Prisma.StringFilter,
                  },
                  {
                    description: {
                      contains: search,
                      mode: "insensitive",
                    } as Prisma.StringFilter,
                  },
                ],
              },
            ]
          : []),
      ],
    };

    const projects = (await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })) as Project[];

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function getProject(id: string | number): Promise<Project | null> {
  try {
    const projectId = typeof id === "string" ? parseInt(id, 10) : id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw new Error("Failed to fetch project");
  }
}
