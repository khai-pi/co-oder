// import { Project } from "./project";
import { User } from "@prisma/client";

export interface UserInput {
  email: string;
  password: string;
  username: string;
}

// export interface User extends UserInput {
//   id: number;
//   projects?: Project[];
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface CreateUserResponse {
  user?: User;
  error?: {
    code: string;
    message: string;
  };
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};
