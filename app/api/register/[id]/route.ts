import { prisma } from "@/app/utils/prisma";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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
      const { firstName, lastName, userType } = await req.json();
      const idString = params.id;

      const data = {
        id: idString,
        firstName: firstName,
        lastName: lastName,
        userType: userType
      };

      const RegisteredUserSchema = z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        userType: z.string()
      });

      RegisteredUserSchema.parse(data);

      await prisma.users.create({
        data: {
          id: idString,
          firstName: firstName,
          lastName: lastName,
          userType: userType
        }
      });

      return NextResponse.json(
        { message: "User created successfully!" },
        { status: 200 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: "User creation failed!" },
      { status: 401 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
