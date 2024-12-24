// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

import { login } from "@/lib/services/auth/login/login";

export async function POST(request: NextRequest) {
  try {
    // console.log("Login route called"); // Debug log
    // const { email, password } = await request.json();

    // const result = await login(email, password);
    // console.log("Login successful, returning response"); // Debug log

    // return NextResponse.json(result);

    const { email, password } = await request.json();

    const { token, user, session } = await login(email, password);

    // Create response with data
    const response = NextResponse.json({
      user,
      token,
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
      },
    });

    // Set cookie directly on response
    response.cookies.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: session.expiresAt,
      path: "/",
    });

    console.log("Response cookies:", response.cookies.getAll());
    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Login failed",
        },
      },
      { status: 401 }
    );
  }
}
