import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserDataWithId } from "@/app/utils/getUserDataWithId";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { clientId, ...projectData } = await req.json();

    const clientUser = await getUserDataWithId(clientId);
    if (!clientUser) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Check if the clientUser exists in the Users model
    const user = await prisma.users.findUnique({
      where: { id: clientUser.id }
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newproject = await prisma.Project.create({
      data: {
        projectName: projectData.projectName,
        category: projectData.category,
        projectManagement: projectData.projectManagement,
        position: projectData.position,
        language: projectData.language,
        description: projectData.description,
        userId: user.id
      }
    });

    return NextResponse.json(newproject, { status: 201 });
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
