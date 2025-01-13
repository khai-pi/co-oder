import { NextRequest } from "next/server";

import { changePassword } from "@/lib/services/users/changePassword";

import { POST } from "../../src/app/api/users/change-password/route";

jest.mock("@/lib/services/users/changePassword");
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cache: (fn: any) => fn,
}));

describe("POST /api/user/change-password", () => {
  it("should return 200 and success response when password change is successful", async () => {
    // Mock the changePassword service
    const mockChangePasswordResponse = {
      success: true,
      message: "Password changed successfully",
    };
    (changePassword as jest.Mock).mockResolvedValueOnce(
      mockChangePasswordResponse
    );

    // Create a mock request
    const req = new NextRequest("http://localhost/api/user/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: "oldPassword123",
        newPassword: "newPassword456",
      }),
    });

    // Call the POST handler
    const res = await POST(req);

    // Parse the response
    const responseBody = await res.json();

    // Assertions
    expect(res.status).toBe(200);
    expect(responseBody).toEqual(mockChangePasswordResponse);
    expect(changePassword).toHaveBeenCalledWith({
      currentPassword: "oldPassword123",
      newPassword: "newPassword456",
    });
  });

  it("should return 400 and error message when password change fails", async () => {
    // Mock the changePassword service
    const mockChangePasswordResponse = {
      success: false,
      message: "Incorrect current password",
    };
    (changePassword as jest.Mock).mockResolvedValueOnce(
      mockChangePasswordResponse
    );

    // Create a mock request
    const req = new NextRequest("http://localhost/api/user/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: "wrongPassword",
        newPassword: "newPassword456",
      }),
    });

    // Call the POST handler
    const res = await POST(req);

    // Parse the response
    const responseBody = await res.json();

    // Assertions
    expect(res.status).toBe(400);
    expect(responseBody).toEqual({ error: "Incorrect current password" });
    expect(changePassword).toHaveBeenCalledWith({
      currentPassword: "wrongPassword",
      newPassword: "newPassword456",
    });
  });

  it("should return 500 and error message on server error", async () => {
    // Mock the changePassword service to throw an error
    (changePassword as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    // Create a mock request
    const req = new NextRequest("http://localhost/api/user/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: "oldPassword123",
        newPassword: "newPassword456",
      }),
    });

    // Call the POST handler
    const res = await POST(req);

    // Parse the response
    const responseBody = await res.json();

    // Assertions
    expect(res.status).toBe(500);
    expect(responseBody).toEqual({
      success: false,
      message: "Internal server error",
    });
    expect(changePassword).toHaveBeenCalledWith({
      currentPassword: "oldPassword123",
      newPassword: "newPassword456",
    });
  });
});
