import { getProfilePicture } from "@/app/utils/getProfilePicture";
import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Bid {
  id: string;
  bidComment: string;
  projectId: string;
  userId: string;
  userProfilePic: string;
  userUsername: string;
  userDisplayName: string;
}

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

      const project = await prisma.projects.findUnique({
        where: { id: idString }
      });

      if (!project) {
        throw new Error("No project found!");
      }

      const bids = await prisma.bids.findMany({
        where: {
          projectId: idString
        }
      });
      if (bids.length === 0) {
        throw new Error("No bids found!");
      }

      const bidList: Bid[] = [];

      for (const bid of bids) {
        const user = await prisma.users.findUnique({
          where: { id: bid.userId }
        });
        if (user) {
          const userPhotoURL = await getProfilePicture(user.profilePicture);
          const data = {
            ...bid,
            userDisplayName: user.displayName,
            userProfilePic: userPhotoURL,
            userUsername: user.username
          };
          bidList.push(data);
        }
      }

      await prisma.$disconnect();
      return NextResponse.json({ bidList }, { status: 200 });
    }
  } catch (err) {
    await prisma.$disconnect();
    return NextResponse.json({ bidList: null }, { status: 404 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params
  }: {
    params: { id: string };
  }
): Promise<NextResponse> {
  const { userId } = await req.json();

  try {
    if (!params.id) {
      throw new Error("ID params not found!");
    } else {
      const idString = params.id;
      const project = await prisma.projects.update({
        where: {
          id: idString
        },
        data: {
          developerId: userId
        }
      });
      if (!project) {
        throw new Error("No projects found!");
      }
      await prisma.$disconnect();
      return NextResponse.json({ project }, { status: 200 });
    }
  } catch (err) {
    await prisma.$disconnect();
    return NextResponse.json({ projects: null }, { status: 404 });
  } finally {
    await prisma.$disconnect();
  }
}
