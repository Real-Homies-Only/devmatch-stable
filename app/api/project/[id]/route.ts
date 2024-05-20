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

export async function PATCH(
  req: NextRequest,
  {
    params
  }: {
    params: { id: string };
  }
): Promise<NextResponse> {
  const idString = params.id;
  try {
    if (!idString) {
      throw new Error("ID params not found!");
    } else {
      const { progress, finished } = await req.json();

      const project = await prisma.projects.update({
        where: {
          id: idString
        },
        data: {
          progress,
          finished
        }
      });
      if (!project) {
        throw new Error("No projects found!");
      }
      await prisma.$disconnect();
      return NextResponse.json({ project }, { status: 202 });
    }
  } catch (err) {
    await prisma.$disconnect();
    return NextResponse.json({ projects: null }, { status: 404 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params
  }: {
    params: { id: string };
  }
): Promise<NextResponse> {
  const idString = params.id;
  try {
    if (!idString) {
      throw new Error("ID params not found!");
    } else {
      const project = await prisma.projects.delete({
        where: {
          id: idString
        },
        include: { bid: true }
      });
      if (!project) {
        throw new Error("No projects found!");
      }
      return NextResponse.json({ status: 200 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ projects: null }, { status: 400 });
  } finally {
    await prisma.$disconnect();
  }
}
