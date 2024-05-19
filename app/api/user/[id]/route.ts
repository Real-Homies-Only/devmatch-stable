import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserDataWithId } from "@/app/utils/getUserDataWithId";

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
      const user = await getUserDataWithId(idString);
      if (!user) {
        throw new Error("User not found!");
      }
      await prisma.$disconnect();
      return NextResponse.json({ user }, { status: 200 });
    }
  } catch (err) {
    await prisma.$disconnect();
    return NextResponse.json({ user: null }, { status: 404 });
  } finally {
    await prisma.$disconnect();
  }
}
