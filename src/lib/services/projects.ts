import { Prisma } from "@prisma/client";

import { Project } from "@/types/project";
import { prisma } from "@/lib/prisma";

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
    const where: Prisma.ProjectWhereInput = {
      AND: [
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
            name: true,
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
