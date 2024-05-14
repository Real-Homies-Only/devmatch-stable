import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params
  }: {
    params: { id: string };
  }
): Promise<NextResponse> {
  try {
    if (!params.id) {
      throw new Error("ID params not found!");
    } else {
      const idString = params.id;
      const project = await prisma.projects.findUnique({
        where: {
          id: idString
        }
      });
      if (!project) {
        throw new Error("No projects found!");
      }
      await prisma.$disconnect();
      return NextResponse.json({ project }, { status: 200 });
    }
  } catch (err) {
    await prisma.$disconnect();
    return NextResponse.json({ projects: null }, { status: 404 });
  } finally {
    await prisma.$disconnect();
  }
}
