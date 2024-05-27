import { getProfilePicture } from "@/app/utils/getProfilePicture";
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
      const ratings = await prisma.ratings.findMany({
        where: {
          userId: idString
        },
        select: {
          id: true,
          rating: true,
          comment: true,
          project: {
            select: {
              projectName: true,
              clientId: true,
              client: {
                select: {
                  username: true,
                  displayName: true,
                  profilePicture: true
                }
              }
            }
          }
        }
      });

      const user = await prisma.users.findUnique({
        where: {
          id: idString
        }
      });

      if (!user) {
        throw new Error("User not found!");
      }

      if (ratings.length === 0) {
        throw new Error("No projects found!");
      }

      ratings.forEach(async (rating) => {
        const profilePic = rating.project.client.profilePicture;
        rating.project.client.profilePicture =
          await getProfilePicture(profilePic);
      });

      await prisma.$disconnect();
      return NextResponse.json({ ratings }, { status: 200 });
    }
  } catch (err) {
    await prisma.$disconnect();
    return NextResponse.json({ ratings: null }, { status: 404 });
  } finally {
    await prisma.$disconnect();
  }
}
