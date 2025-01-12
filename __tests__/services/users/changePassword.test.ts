import { Session, User } from "@prisma/client";
import { compare, hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import type { SessionValidationResult } from "@/lib/services/auth/session/session";
// Import the mocked function after the mock is defined
import { getCurrentSession } from "@/lib/services/auth/session/session";
import { changePassword } from "@/lib/services/users/changePassword";

// Mock the entire getCurrentSession module
jest.mock("@/lib/services/auth/session/session", () => ({
  getCurrentSession: jest.fn(),
}));

// Create a proper mock type for Prisma client
type MockPrismaClient = {
  user: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));
jest.mock("bcryptjs");

// Mock types with proper typing
const mockPrisma = prisma as unknown as MockPrismaClient;
const mockGetCurrentSession =
  getCurrentSession as unknown as jest.MockedFunction<
    () => Promise<SessionValidationResult>
  >;
const mockCompare = compare as unknown as jest.MockedFunction<
  (value: string, hash: string) => Promise<boolean>
>;
const mockHash = hash as unknown as jest.MockedFunction<
  (value: string, salt: number | string) => Promise<string>
>;

describe("changePassword", () => {
  // Mock user data
  const mockUser: Partial<User> = {
    id: 1,
    email: "test@example.com",
    password: "hashed_current_password",
  };

  // Setup and teardown
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementations
    mockHash.mockResolvedValue("hashed_new_password");
    mockCompare.mockResolvedValue(true);
  });

  it("should successfully change password when all inputs are valid", async () => {
    // Arrange
    mockGetCurrentSession.mockResolvedValue({
      session: {
        id: "session_id",
        userId: 1,
        expiresAt: new Date(),
      } as Session,
      user: { id: 1, email: "test@example.com" } as User,
    });

    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.user.update.mockResolvedValue(mockUser);

    // Act
    const result = await changePassword({
      currentPassword: "current_password",
      newPassword: "new_password",
    });

    // Assert
    expect(result).toEqual({
      success: true,
      message: "Password changed successfully",
    });
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { password: "hashed_new_password" },
    });
  });

  it("should fail when user is not authenticated", async () => {
    // Arrange
    mockGetCurrentSession.mockResolvedValue({
      session: null,
      user: null,
    });

    // Act
    const result = await changePassword({
      currentPassword: "current_password",
      newPassword: "new_password",
    });

    // Assert
    expect(result).toEqual({
      success: false,
      message: "Not authenticated",
    });
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });
});
