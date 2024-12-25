import { Session } from "@prisma/client";

import { User, UserInput } from "@/types/user";
import {
  createSession,
  generateSessionToken,
} from "@/lib/services/auth/session/session";
import { signUp } from "@/lib/services/auth/sign-up/signup";
import { createUser } from "@/lib/services/users/createUser";

// Mock all dependencies
jest.mock("@/lib/services/users/createUser", () => ({
  createUser: jest.fn(),
}));

jest.mock("@/lib/services/auth/session/session", () => ({
  generateSessionToken: jest.fn(),
  createSession: jest.fn(),
}));

jest.mock("react", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cache: (fn: any) => fn,
}));

describe("signUp", () => {
  // Mock data
  const mockUserInput: UserInput = {
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  };

  const mockUser: User = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
    password: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockToken = "mock-session-token";

  const mockSession: Session = {
    id: "session-1",
    userId: 1,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    jest.mocked(createUser).mockResolvedValue({ user: mockUser });
    jest.mocked(generateSessionToken).mockReturnValue(mockToken);
    jest.mocked(createSession).mockResolvedValue(mockSession);
  });

  it("should successfully create a new user and session", async () => {
    const result = await signUp(mockUserInput);

    // Verify the user was created with correct input
    expect(createUser).toHaveBeenCalledWith(mockUserInput);

    // Verify session token was generated
    expect(generateSessionToken).toHaveBeenCalled();

    // Verify session was created with correct params
    expect(createSession).toHaveBeenCalledWith(mockToken, mockUser.id);

    // Verify the returned data structure
    expect(result).toEqual({
      token: mockToken,
      user: mockUser,
      session: mockSession,
    });
  });

  it("should throw error if user creation fails", async () => {
    const mockError = new Error("User creation failed");
    jest.mocked(createUser).mockRejectedValue(mockError);

    await expect(signUp(mockUserInput)).rejects.toThrow("User creation failed");

    // Verify session was not created
    expect(createSession).not.toHaveBeenCalled();
  });

  it("should throw error if session creation fails", async () => {
    const mockError = new Error("Session creation failed");
    jest.mocked(createSession).mockRejectedValue(mockError);

    await expect(signUp(mockUserInput)).rejects.toThrow(
      "Session creation failed"
    );
  });

  it("should throw 'Unknown error' for non-Error objects", async () => {
    jest.mocked(createUser).mockRejectedValue("Some string error");

    await expect(signUp(mockUserInput)).rejects.toThrow("Unknown error");
  });
});
