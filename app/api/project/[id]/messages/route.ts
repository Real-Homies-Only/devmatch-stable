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

      const project = await prisma.projects.findFirst({
        where: {
          id: idString
        }
      });

      if (!project) {
        return NextResponse.json({ messages: null }, { status: 404 });
      }

      const messages = await prisma.messages.findMany({
        where: {
          projectId: idString
        }
      });

      if (!messages || messages.length === 0) {
        throw new Error("Messages not found!");
      }

      const formatDateOrTime = (date: Date) => {
        const now = new Date();
        const messageDate = new Date(date);
        const diffInHours =
          (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
          return messageDate.toLocaleTimeString();
        } else {
          return `${messageDate.toLocaleDateString()} ${messageDate.toLocaleTimeString()}`;
        }
      };

      const formattedMessages = messages.map((message) => {
        const formattedTime = formatDateOrTime(message.sentTime);
        return {
          ...message,
          sentTime: String(formattedTime)
        };
      });

      await prisma.$disconnect();
      return NextResponse.json({ formattedMessages }, { status: 200 });
    }
  } catch (err) {
    await prisma.$disconnect();
    return NextResponse.json({ messages: null }, { status: 404 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(
  req: NextRequest,
  {
    params
  }: {
    params: { id: string };
  }
): Promise<NextResponse> {
  const { userId, content, type } = await req.json();

  try {
    if (!params.id) {
      throw new Error("ID params not found!");
    } else {
      const idString = params.id;
      const message = await prisma.messages.create({
        data: {
          content,
          projectId: idString,
          senderId: userId,
          type
        }
      });

      await prisma.$disconnect();
      return NextResponse.json({ message }, { status: 201 });
    }
  } catch (err) {
    await prisma.$disconnect();
    return NextResponse.json({ message: null }, { status: 406 });
  } finally {
    await prisma.$disconnect();
  }
}
