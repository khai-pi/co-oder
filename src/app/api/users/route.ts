// app/api/users/route.ts
import { NextResponse } from "next/server";

import type { UserInput } from "@/types/user";
import { createUser } from "@/lib/services/users/createUser";

export async function POST(request: Request) {
  try {
    // Add error handling for JSON parsing
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_INPUT",
            message: (e as Error).message || "Invalid JSON in request body",
          },
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body?.name || !body?.email || !body?.password) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_INPUT",
            message: "Missing required fields",
          },
        },
        { status: 400 }
      );
    }

    // Extract user input
    const userInput: UserInput = {
      name: body.name,
      email: body.email,
      password: body.password,
    };

    // Call createUser function
    const result = await createUser(userInput);

    if (result.error) {
      const statusCodes: Record<string, number> = {
        INVALID_INPUT: 400,
        USER_EXISTS: 409,
        SERVER_ERROR: 500,
      };

      return NextResponse.json(
        { error: result.error },
        { status: statusCodes[result.error.code] || 400 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: "An unexpected error occurred",
          details: error,
        },
      },
      { status: 500 }
    );
  }
}
