// app/api/projects/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/services/auth/session/session";

export async function POST(req: Request) {
  try {
    const { session, user } = await getCurrentSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const project = await prisma.project.create({
      data: {
        ...json,
        ownerId: user.id,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
