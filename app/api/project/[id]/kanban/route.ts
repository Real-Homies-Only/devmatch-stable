import { prisma } from "@/app/utils/prisma";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params
  }: {
    params: { id: string };
  }
): Promise<NextResponse> {
  const idString = params.id;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: idString
      }
    });
    return NextResponse.json(tasks);
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching tasks" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { column, title, projectId } = await request.json();

    const taskSchema = z.object({
      column: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "DONE"]),
      title: z.string(),
      projectId: z.string()
    });

    const data = taskSchema.parse({ column, title, projectId });

    const newTask = await prisma.task.create({
      data: {
        column: data.column,
        title: data.title,
        projectId: data.projectId
      }
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error creating task" },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const { id, column, title } = await request.json();

    const taskSchema = z.object({
      id: z.string(),
      column: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "DONE"]),
      title: z.string()
    });

    const data = taskSchema.parse({ id, column, title });

    const updatedTask = await prisma.task.update({
      where: {
        id: data.id
      },
      data: {
        column: data.column,
        title: data.title
      }
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error updating task" },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { id } = await request.json();

    const deletedTask = await prisma.task.delete({
      where: {
        id
      }
    });

    return NextResponse.json(deletedTask, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error deleting task" },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
