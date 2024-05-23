import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { userId, rate, comment } = await req.json();

  try {
    if (!params.id) {
      throw new Error("ID params not found!");
    } else {
      const idString = params.id;

      const existingRating = await prisma.ratings.findFirst({
        where: {
          projectId: idString
        }
      });

      if (existingRating) {
        return NextResponse.json(
          { message: "You already have a rating on this project!" },
          { status: 401 }
        );
      }

      const rating = await prisma.ratings.create({
        data: {
          comment,
          projectId: idString,
          userId,
          rating: rate
        }
      });

      if (!rating) {
        throw new Error("Error creating rating!");
      }

      await prisma.$disconnect();
      return NextResponse.json({ rating }, { status: 200 });
    }
  } catch (err) {
    await prisma.$disconnect();
    return NextResponse.json(
      { message: "Error finishing project!" },
      { status: 404 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
