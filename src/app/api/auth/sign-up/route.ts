// src/app/api/auth/sign-up/route.ts
import { NextRequest, NextResponse } from "next/server";

import { signUp } from "@/lib/services/auth/sign-up/signup";

export async function POST(request: NextRequest) {
  try {
    const userInput = await request.json();

    const { user, token, session } = await signUp(userInput);
    return NextResponse.json({
      user,
      token,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json(
      { error: { message: "Failed to create account" } },
      { status: 500 }
    );
  }
}
