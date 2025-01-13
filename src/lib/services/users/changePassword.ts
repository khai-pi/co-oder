import { compare, hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";

import { getCurrentSession } from "../auth/session/session";

// Define the ChangePasswordResponse type
type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

export async function changePassword(body: {
  currentPassword: string;
  newPassword: string;
}): Promise<ChangePasswordResponse> {
  try {
    // Get the authenticated session
    const session = await getCurrentSession();

    if (!session?.user?.email) {
      return { success: false, message: "Not authenticated" };
    }

    // Get the request body
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return { success: false, message: "All fields are required" };
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Verify current password
    const passwordsMatch = await compare(currentPassword, user.password);
    if (!passwordsMatch) {
      return { success: false, message: "Current password is incorrect" };
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 12);

    // Update user's password
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Failed to change password:", error);
    return { success: false, message: "Failed to change password" };
  }
}
