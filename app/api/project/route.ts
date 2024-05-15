import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserDataWithId } from "@/app/utils/getUserDataWithId";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { clientId, ...projectData } = await req.json();

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    const clientUser = await getUserDataWithId(clientId);
    if (!clientUser) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const user = await prisma.users.findUnique({
      where: { id: clientUser.id }
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newProject = await prisma.projects.create({
      data: {
        projectName: projectData.projectName,
        category: projectData.category,
        language: projectData.language,
        description: projectData.description,
        clientId: clientId
      }
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
