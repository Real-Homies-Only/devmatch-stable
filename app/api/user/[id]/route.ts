import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserData } from "@/app/utils/getUserData";

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
      const user = await getUserData(idString);
      return NextResponse.json({ user }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 404 });
  } finally {
    await prisma.$disconnect();
  }
}
