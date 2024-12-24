import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { logout } from "@/lib/services/auth/logout/logout";

import * as sessionModule from "../../src/lib/services/auth/session/session";

// Mock the dependencies
jest.mock("@/lib/prisma", () => ({
  prisma: {
    session: {
      delete: jest.fn(),
    },
  },
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("../../src/lib/services/auth/session/session", () => ({
  validateSessionToken: jest.fn(),
  deleteSessionTokenCookie: jest.fn(),
}));

describe("logout", () => {
  const mockToken = "test-session-token";
  const mockSession = {
    id: "test-session-id",
    userId: 1,
    expiresAt: new Date(),
  };

  const mockCookieGet = jest.fn();
  const mockCookieStore = {
    get: mockCookieGet,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);
    mockCookieGet.mockReturnValue({ value: mockToken });
    (sessionModule.validateSessionToken as jest.Mock).mockResolvedValue({
      session: mockSession,
      user: { id: 1, name: "Test User" },
    });
  });

  it("should successfully logout a user", async () => {
    await logout();

    // Verify the session token was retrieved from cookies
    expect(mockCookieStore.get).toHaveBeenCalledWith("session");

    // Verify the session was validated
    expect(sessionModule.validateSessionToken).toHaveBeenCalledWith(mockToken);

    // Verify the session was deleted from the database
    expect(prisma.session.delete).toHaveBeenCalledWith({
      where: { id: mockSession.id },
    });

    // Verify the session cookie was deleted
    expect(sessionModule.deleteSessionTokenCookie).toHaveBeenCalled();
  });

  it("should handle case when no session token exists", async () => {
    mockCookieGet.mockReturnValue(undefined);

    await logout();

    // Verify no further actions were taken
    expect(sessionModule.validateSessionToken).not.toHaveBeenCalled();
    expect(prisma.session.delete).not.toHaveBeenCalled();
  });

  it("should handle case when session validation returns no session", async () => {
    (sessionModule.validateSessionToken as jest.Mock).mockResolvedValue({
      session: null,
      user: null,
    });

    await logout();

    // Verify no database deletion was attempted
    expect(prisma.session.delete).not.toHaveBeenCalled();
    // Verify cookie was still deleted
    expect(sessionModule.deleteSessionTokenCookie).toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async () => {
    (prisma.session.delete as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await expect(logout()).rejects.toThrow("Database error");
  });

  // it('should handle cookie deletion errors', async () => {
  //   (sessionModule.deleteSessionTokenCookie as jest.Mock).mockRejectedValue(new Error('Cookie error'));

  //   await expect(logout()).rejects.toThrow('Cookie error');
  // });
});
