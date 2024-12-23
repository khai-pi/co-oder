// src/lib/services/users/createUser.ts
import { hash } from "bcryptjs";

import type { CreateUserResponse, User, UserInput } from "@/types/user";
import { prisma } from "@/lib/prisma";
import { validateUserInput } from "@/lib/utils/validation";

export async function createUser(
  input: UserInput
): Promise<CreateUserResponse> {
  try {
    // Validate input
    const validation = validateUserInput(input);
    if (!validation.isValid) {
      return {
        error: {
          code: "INVALID_INPUT",
          message: validation.error || "Invalid input",
        },
      };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      return {
        error: {
          code: "USER_EXISTS",
          message: "User with this email already exists",
        },
      };
    }

    // Hash password
    const hashedPassword = await hash(input.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
    });

    // Remove password from returned user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as User,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      error: {
        code: "SERVER_ERROR",
        message: "Failed to create user",
      },
    };
  }
}
