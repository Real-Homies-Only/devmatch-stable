import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  console.log("Received POST request:", req.url);
  const { bidComment, userId } = await req.json();

  try {
    if (!params.id) {
      throw new Error("ID params not found!");
    } else {
      const idString = params.id;
      const bid = await prisma.bids.create({
        data: {
          bidComment,
          projectId: idString,
          userId
        }
      });

      if (!bid) {
        throw new Error("Error creating bid!");
      }

      await prisma.$disconnect();
      return NextResponse.json({ bid }, { status: 200 });
    }
  } catch (err) {
    await prisma.$disconnect();
    return NextResponse.json({ error: "ERROR!" }, { status: 404 });
  } finally {
    await prisma.$disconnect();
  }
}
