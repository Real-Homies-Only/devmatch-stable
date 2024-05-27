import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserDataWithUsername } from "@/app/utils/getUserDataWithUsername";

export async function GET(
  req: NextRequest,
  {
    params
  }: {
    params: { username: string };
  }
): Promise<NextResponse> {
  try {
    if (!params.username) {
      throw new Error("ID params not found!");
    } else {
      const usernameString = params.username;
      const user = await getUserDataWithUsername(usernameString);

      if (!user) {
        throw new Error("User not found!");
      }

      return NextResponse.json({ user }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 404 });
  } finally {
    await prisma.$disconnect();
  }
}
