import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

import {
  createSession,
  generateSessionToken,
  getCurrentSession,
  invalidateSession,
  setSessionTokenCookie,
  validateSessionToken,
  // deleteSessionTokenCookie
} from "../../src/lib/services/auth/session/session";

jest.mock("react", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cache: (fn: any) => fn,
}));

// Mock next/headers
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

// Mock prisma client
jest.mock("@/lib/prisma", () => ({
  prisma: {
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock crypto API
const mockRandomValues = jest.fn();
Object.defineProperty(global, "crypto", {
  value: {
    getRandomValues: mockRandomValues,
    subtle: {
      digest: jest.fn().mockImplementation(async () => {
        // Return a fixed buffer for testing
        return new Uint8Array([1, 2, 3, 4]).buffer;
      }),
    },
  },
});

describe("Session Management", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock for getRandomValues
    mockRandomValues.mockImplementation((buffer) => {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = i % 256;
      }
      return buffer;
    });
  });

  describe("generateSessionToken", () => {
    it("should generate a token with correct format", () => {
      const token = generateSessionToken();
      expect(typeof token).toBe("string");
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(token.length).toBeGreaterThan(0);
    });

    it("should generate unique tokens", () => {
      // Mock different random values for each call
      mockRandomValues
        .mockImplementationOnce((buffer) => buffer.fill(1))
        .mockImplementationOnce((buffer) => buffer.fill(2));

      const token1 = generateSessionToken();
      const token2 = generateSessionToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe("createSession", () => {
    const mockToken = "test-token";
    const mockUserId = 1;
    const mockSession = {
      id: expect.any(String), // Now expecting hex string from SHA-256
      userId: mockUserId,
      expiresAt: expect.any(Date),
    };

    beforeEach(() => {
      (prisma.session.create as jest.Mock).mockResolvedValue(mockSession);
    });

    it("should create a session with correct data", async () => {
      const session = await createSession(mockToken, mockUserId);

      expect(prisma.session.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockUserId,
          expiresAt: expect.any(Date),
          id: expect.any(String),
        }),
      });

      expect(session).toEqual(mockSession);
    });

    it("should create session with correct expiry date", async () => {
      const now = new Date();
      jest.useFakeTimers().setSystemTime(now);

      await createSession(mockToken, mockUserId);

      const expectedExpiry = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);
      expect(prisma.session.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          expiresAt: expectedExpiry,
        }),
      });

      jest.useRealTimers();
    });
  });

  describe("validateSessionToken", () => {
    const mockToken = "test-token";

    beforeEach(() => {
      // Set a fixed date for testing
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-01-01"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });
    const mockSession = {
      id: "session-id",
      userId: 1,
      expiresAt: new Date("2024-01-31"),
      user: {
        id: 1,
        email: "test@example.com",
      },
    };

    it("should return valid session and user for valid token", async () => {
      (prisma.session.findUnique as jest.Mock).mockResolvedValue(mockSession);

      const result = await validateSessionToken(mockToken);

      const { user, ...session } = mockSession;
      expect(result).toEqual({ session, user });
    });

    it("should return null for non-existent session", async () => {
      (prisma.session.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await validateSessionToken(mockToken);
      expect(result).toEqual({ session: null, user: null });
    });

    it("should delete and return null for expired session", async () => {
      const expiredSession = {
        ...mockSession,
        expiresAt: new Date(Date.now() - 1000),
      };

      (prisma.session.findUnique as jest.Mock).mockResolvedValue(
        expiredSession
      );

      const result = await validateSessionToken(mockToken);

      expect(prisma.session.delete).toHaveBeenCalled();
      expect(result).toEqual({ session: null, user: null });
    });

    it("should extend session if close to expiry", async () => {
      const nearExpirySession = {
        ...mockSession,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      };

      (prisma.session.findUnique as jest.Mock).mockResolvedValue(
        nearExpirySession
      );
      (prisma.session.update as jest.Mock).mockResolvedValue({
        ...nearExpirySession,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });

      await validateSessionToken(mockToken);

      expect(prisma.session.update).toHaveBeenCalled();
    });
  });

  // Rest of the tests remain largely the same...
  describe("invalidateSession", () => {
    it("should delete the session", async () => {
      const sessionId = "test-session-id";
      await invalidateSession(sessionId);

      expect(prisma.session.delete).toHaveBeenCalledWith({
        where: { id: sessionId },
      });
    });
  });

  describe("setSessionTokenCookie", () => {
    const mockCookieStore = {
      set: jest.fn(),
    };

    beforeEach(() => {
      (cookies as jest.Mock).mockReturnValue(mockCookieStore);
    });

    it("should set cookie with correct parameters", async () => {
      const token = "test-token";
      const expiresAt = new Date();

      await setSessionTokenCookie(token, expiresAt);

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "session",
        token,
        expect.objectContaining({
          httpOnly: true,
          sameSite: "lax",
          expires: expiresAt,
          path: "/",
        })
      );
    });
  });

  describe("getCurrentSession", () => {
    const mockCookieStore = {
      get: jest.fn(),
      set: jest.fn(),
    };

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-01-01"));
      (cookies as jest.Mock).mockReturnValue(mockCookieStore);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return null when no session cookie exists", async () => {
      mockCookieStore.get.mockReturnValue(null);

      const result = await getCurrentSession();
      expect(result).toEqual({ session: null, user: null });
    });

    it("should validate and return session when cookie exists", async () => {
      const mockToken = "test-token";
      const mockSession = {
        id: "session-id",
        userId: 1,
        expiresAt: new Date("2024-01-31"),
        user: {
          id: 1,
          email: "test@example.com",
        },
      };

      mockCookieStore.get.mockReturnValue({ value: mockToken });
      (prisma.session.findUnique as jest.Mock).mockResolvedValue(mockSession);

      const result = await getCurrentSession();

      const { user, ...session } = mockSession;
      expect(result).toEqual({ session, user });
    });
  });
});
