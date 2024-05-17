import { prisma } from "@/app/utils/prisma";
import { NextResponse } from "next/server";
export async function GET(): Promise<NextResponse> {
  try {
    const projects = await prisma.projects.findMany({
      select: {
        id: true,
        projectName: true,
        category: true,
        language: true,
        description: true,
        client: {
          select: {
            displayName: true
          }
        }
      }
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
