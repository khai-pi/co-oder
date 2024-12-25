import { Session, User } from "@prisma/client";

import { CreateUserResponse, UserInput } from "@/types/user";

import { createUser } from "../../users/createUser";
import {
  createSession,
  generateSessionToken,
  // setSessionTokenCookie,
} from "../session/session";

interface SignUpResponse {
  token: string;
  user: User;
  session: Session;
}

// TODO better error handling
export async function signUp(userInput: UserInput): Promise<SignUpResponse> {
  try {
    const createUserResponse: CreateUserResponse = await createUser(userInput);

    const token = generateSessionToken();

    const session = await createSession(
      token,
      createUserResponse.user?.id as number
    );

    // setSessionTokenCookie(token, session.expiresAt);

    return { token, user: createUserResponse.user as User, session };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}
