import { cookies } from "next/headers";

import { prisma } from "../../../prisma";
import {
  deleteSessionTokenCookie,
  validateSessionToken,
} from "../session/session";

export async function logout(): Promise<void> {
  try {
    // Get the current session token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return; // No active session to logout from
    }

    // Validate the session token and get the session details
    const { session } = await validateSessionToken(token);

    if (session) {
      // Delete the session from the database
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });
    }

    // Clear the session cookie
    await deleteSessionTokenCookie();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to logout"
    );
  }
}
