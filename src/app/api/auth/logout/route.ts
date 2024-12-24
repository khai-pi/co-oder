// src/app/api/auth/sign-up/route.ts
import { NextResponse } from "next/server";

import { logout } from "@/lib/services/auth/logout/logout";

export async function POST() {
  try {
    await logout();

    return NextResponse.json(
      { message: "Successfully logged out" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout failed:", error);
    return NextResponse.json(
      { error: { message: "Failed to logout" } },
      { status: 500 }
    );
  }
}
