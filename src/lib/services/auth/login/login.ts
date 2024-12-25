import { Session, User } from "@prisma/client";
import { compare } from "bcryptjs";

import { prisma } from "@/lib/prisma";

import {
  createSession,
  generateSessionToken,
  // setSessionTokenCookie,
} from "../session/session";

interface LoginResponse {
  token: string;
  user: User;
  session: Session;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    // const hashedPassword = await hash(password, 12);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!(await compare(password, user.password))) {
      throw new Error("Invalid password");
    }

    const token = generateSessionToken();

    const session = await createSession(token, user.id);

    // setSessionTokenCookie(token, session.expiresAt);

    return { token, user, session };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}
