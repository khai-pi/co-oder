// src/__tests__/app/api/users/route.test.ts
import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/auth/route";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
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

describe("POST /api/users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validUserData = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  it("should create a new user successfully", async () => {
    // Mock prisma responses
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 1,
      ...validUserData,
      password: "hashedPassword123",
      createdAt: new Date(),
      updatedAt: new Date(),
      projects: [],
    });

    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validUserData),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const responseData = await response.json();
    expect(responseData.user).toBeDefined();
    expect(responseData.user.password).toBeUndefined();
    expect(responseData.user.email).toBe(validUserData.email);
    expect(responseData.error).toBeUndefined();
  });

  it("should handle invalid JSON", async () => {
    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "invalid json",
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const responseData = await response.json();
    expect(responseData.error.code).toBe("INVALID_INPUT");
  });

  it("should handle missing required fields", async () => {
    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Test User" }), // Missing email and password
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const responseData = await response.json();
    expect(responseData.error.code).toBe("INVALID_INPUT");
    expect(responseData.error.message).toBe("Missing required fields");
  });

  it("should handle existing user with 409 status", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: validUserData.email,
    });

    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validUserData),
    });

    const response = await POST(request);
    expect(response.status).toBe(409);

    const responseData = await response.json();
    expect(responseData.error.code).toBe("USER_EXISTS");
  });

  it("should handle database errors with 500 status", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validUserData),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);

    const responseData = await response.json();
    expect(responseData.error.code).toBe("SERVER_ERROR");
  });

  it("should validate email format", async () => {
    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...validUserData,
        email: "invalid-email",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const responseData = await response.json();
    expect(responseData.error.code).toBe("INVALID_INPUT");
  });

  it("should validate password length", async () => {
    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...validUserData,
        password: "123", // Too short
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const responseData = await response.json();
    expect(responseData.error.code).toBe("INVALID_INPUT");
  });
});
