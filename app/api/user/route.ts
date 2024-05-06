import { prisma } from "@/app/utils/prisma";
import { UserSchema } from "@/app/utils/UserProps";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextResponse,
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

      return NextResponse.json({ id: idString }, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 404 });
  }
}
