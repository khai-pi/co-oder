// /__tests__/createUser.test.ts
import { hash } from "bcryptjs";

import { prisma } from "../src/lib/prisma";
import { createUser } from "../src/lib/services/users/createUser";
import { UserInput } from "../src/types/user";

// Mock prisma
jest.mock("../src/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock bcryptjs
jest.mock("bcryptjs", () => ({
  hash: jest.fn(() => "hashedPassword123"),
}));

describe("createUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validUserInput: UserInput = {
    email: "test@example.com",
    password: "password123",
    username: "Test User",
  };

  it("should create a new user successfully", async () => {
    // Mock that user doesn't exist
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const mockCreatedUser = {
      id: 1,
      email: validUserInput.email,
      password: "hashedPassword123",
      username: validUserInput.username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

    const result = await createUser(validUserInput);

    // Check the result
    expect(result.error).toBeUndefined();
    expect(result.user).toBeDefined();
    expect(result.user?.password).toBeUndefined(); // Password should be removed
    expect(result.user?.email).toBe(validUserInput.email);
    expect(result.user?.username).toBe(validUserInput.username);

    // Verify prisma calls
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: validUserInput.email },
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: validUserInput.email,
        username: validUserInput.username,
        password: "hashedPassword123",
      }),
    });

    expect(hash).toHaveBeenCalledWith(validUserInput.password, 12);
  });

  it("should return error for existing user", async () => {
    // Mock that user already exists with proper types
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: validUserInput.email,
      name: "Existing User",
      password: "hashedPassword",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createUser(validUserInput);

    expect(result.user).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe("USER_EXISTS");
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("should validate email format", async () => {
    const invalidInput = {
      ...validUserInput,
      email: "invalid-email",
    };

    const result = await createUser(invalidInput);

    expect(result.user).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe("INVALID_INPUT");
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("should validate password length", async () => {
    const invalidInput = {
      ...validUserInput,
      password: "123",
    };

    const result = await createUser(invalidInput);

    expect(result.user).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe("INVALID_INPUT");
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const result = await createUser(validUserInput);

    expect(result.user).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe("SERVER_ERROR");
  });
});
