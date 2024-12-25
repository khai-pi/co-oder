// src/types/project.ts
// TODO: https://github.com/prisma/prisma/discussions/10928
export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  skills: string[];
  status: string;
  likes: number;
  comments: number;
  collaborators: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: number;
  owner: {
    id: number;
    name: string;
  };
}
