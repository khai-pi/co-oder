// src/app/api/auth/sign-up/route.ts
import { NextRequest, NextResponse } from "next/server";

import { signUp } from "@/lib/services/auth/sign-up/signup";

export async function POST(request: NextRequest) {
  try {
    const userInput = await request.json();

    const { user, token, session } = await signUp(userInput);

    const response = NextResponse.json({
      user,
      token,
      expiresAt: session.expiresAt,
    });

    response.cookies.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: session.expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create account",
      },
      { status: 500 }
    );
  }
}
