import { Session } from "@prisma/client";
import { compare } from "bcryptjs";

import { prisma } from "@/lib/prisma";

import { login } from "../../src/lib/services/auth/login/login";
import * as sessionModule from "../../src/lib/services/auth/session/session";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("../../src/lib/services/auth/session/session", () => ({
  generateSessionToken: jest.fn(),
  createSession: jest.fn(),
  setSessionTokenCookie: jest.fn(),
}));

describe("login", () => {
  const mockEmail = "test@example.com";
  const mockPassword = "password123";
  const mockHashedPassword = "hashedPassword123";
  const mockUserId = "123";
  const mockToken = "mockSessionToken";
  const mockExpiresAt = new Date();

  const mockUser = {
    id: mockUserId,
    email: mockEmail,
    password: mockHashedPassword,
  };

  const mockSession: Session = {
    id: "1",
    userId: parseInt(mockUserId),
    expiresAt: mockExpiresAt,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (compare as jest.Mock).mockResolvedValue(true);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
    (sessionModule.generateSessionToken as jest.Mock).mockReturnValue(
      mockToken
    );
    (sessionModule.createSession as jest.Mock).mockResolvedValue(mockSession);
  });

  it("should successfully login a user with correct credentials", async () => {
    const result = await login(mockEmail, mockPassword);

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: mockEmail },
    });

    expect(compare).toHaveBeenCalledWith(mockPassword, mockHashedPassword);
    expect(sessionModule.generateSessionToken).toHaveBeenCalled();
    expect(sessionModule.createSession).toHaveBeenCalledWith(
      mockToken,
      mockUserId
    );
    expect(sessionModule.setSessionTokenCookie).toHaveBeenCalledWith(
      mockToken,
      mockExpiresAt
    );

    expect(result).toEqual({
      token: mockToken,
      user: mockUser,
      session: mockSession,
    });
  });

  it("should throw error when user is not found", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(login(mockEmail, mockPassword)).rejects.toThrow(
      "User not found"
    );
  });

  it("should throw error when password is incorrect", async () => {
    (compare as jest.Mock).mockResolvedValue(false);

    await expect(login(mockEmail, mockPassword)).rejects.toThrow(
      "Invalid password"
    );
  });

  it("should throw error when database query fails", async () => {
    (prisma.user.findFirst as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await expect(login(mockEmail, mockPassword)).rejects.toThrow(
      "Database error"
    );
  });

  it("should throw error when session creation fails", async () => {
    (sessionModule.createSession as jest.Mock).mockRejectedValue(
      new Error("Session creation failed")
    );

    await expect(login(mockEmail, mockPassword)).rejects.toThrow(
      "Session creation failed"
    );
  });

  it("should handle non-Error objects in catch block", async () => {
    (prisma.user.findFirst as jest.Mock).mockRejectedValue("String error");

    await expect(login(mockEmail, mockPassword)).rejects.toThrow(
      "Unknown error"
    );
  });
});
