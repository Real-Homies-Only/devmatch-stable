import { prisma } from "@/app/utils/prisma";
import { UserSchema } from "@/app/utils/UserProps";
import { NextRequest, NextResponse } from "next/server";
import { getProfilePicture } from "@/app/utils/getProfilePicture";

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
      const user = await prisma.users.findFirst({
        where: {
          id: idString
        }
      });
      if (!user) {
        throw new Error("User not found!");
      }

      const url = await getProfilePicture(user.profilePicture);
      user.profilePicture = url;

      UserSchema.parse(user);
      return NextResponse.json({ user }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 404 });
  } finally {
    await prisma.$disconnect();
  }
}
