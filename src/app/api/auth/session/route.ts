// src/app/api/auth/session/route.ts
import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/services/auth/session/session";

export async function GET() {
  try {
    const { session, user } = await getCurrentSession();

    if (!session || !user) {
      return NextResponse.json(
        {
          authenticated: false,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        session: {
          id: session.id,
          expiresAt: session.expiresAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session check failed:", error);
    return NextResponse.json(
      { error: { message: "Failed to check session status" } },
      { status: 500 }
    );
  }
}
