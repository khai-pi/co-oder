// app/api/user/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";

import { changePassword } from "@/lib/services/users/changePassword";

export async function POST(req: NextRequest) {
  try {
    // Get the request body
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    const changePasswordResponse = await changePassword({
      currentPassword,
      newPassword,
    });

    if (!changePasswordResponse.success) {
      return NextResponse.json(
        { error: changePasswordResponse.message },
        { status: 400 }
      );
    }

    return NextResponse.json(changePasswordResponse, { status: 200 });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
