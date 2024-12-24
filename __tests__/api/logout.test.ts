import { logout } from "@/lib/services/auth/logout/logout";

import { POST } from "../../src/app/api/auth/logout/route";

// Mock the logout service
jest.mock("@/lib/services/auth/logout/logout", () => ({
  logout: jest.fn(),
}));

describe("Logout Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/logout", () => {
    it("should successfully logout", async () => {
      const response = await POST();
      const data = await response.json();

      expect(logout).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(data).toEqual({ message: "Successfully logged out" });
    });

    it("should handle logout failure", async () => {
      (logout as jest.Mock).mockRejectedValue(new Error("Logout failed"));

      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: { message: "Failed to logout" } });
    });
  });
});
