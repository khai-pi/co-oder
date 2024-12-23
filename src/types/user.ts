import { Project } from "./project";

export interface UserInput {
  email: string;
  password: string;
  name: string;
}

export interface User extends UserInput {
  id: number;
  projects?: Project[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserResponse {
  user?: User;
  error?: {
    code: string;
    message: string;
  };
}
