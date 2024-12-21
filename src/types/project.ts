// src/types/project.ts
export type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  skills: string[];
  owner: {
    name: string;
  };
  likes: number;
  comments: number;
  collaborators: number;
  status: "Active" | "Completed" | "Planning";
};
