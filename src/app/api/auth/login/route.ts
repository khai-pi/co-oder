// TODO
// src/app/api/auth/sign-up/route.ts
import { NextRequest, NextResponse } from "next/server";

import { login } from "@/lib/services/auth/login/login";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const { user, token, session } = await login(email, password);
    return NextResponse.json({
      user,
      token,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json(
      { error: { message: "Failed to login" } },
      { status: 500 }
    );
  }
}
