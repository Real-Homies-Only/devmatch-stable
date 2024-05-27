import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const bucketName = process.env.BUCKET_NAME || "";
const bucketRegion = process.env.BUCKET_REGION || "";
const accessKey = process.env.AWS_ACCESS_KEY || "";
const secretKey = process.env.AWS_SECRET_KEY || "";

const bucket: S3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    secretAccessKey: secretKey,
    accessKeyId: accessKey
  }
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const clientId = formData.get("clientId")?.toString();
    const projectName = formData.get("projectName")?.toString() ?? "";
    const category = formData.get("category")?.toString() ?? "";
    const language = formData.get("language")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const photo = formData.get("photo");

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    if (photo === null) {
      return NextResponse.json({ error: "No photo provided" }, { status: 400 });
    } else if (photo instanceof File) {
      const photoBuffer = await photo.arrayBuffer();

      const resizedBuffer = await sharp(Buffer.from(photoBuffer))
        .resize(1280, 720, { fit: "contain", position: "center" })
        .png()
        .toBuffer();

      const randomKey = crypto.randomBytes(32).toString("hex");
      const bucketParams = {
        Bucket: bucketName,
        Key: `${randomKey}`,
        Body: resizedBuffer,
        ContentType: "image/png"
      };

      const uploadToBucket = new PutObjectCommand(bucketParams);
      await bucket.send(uploadToBucket);

      const newProject = await prisma.projects.create({
        data: {
          projectName,
          category,
          language,
          description,
          clientId,
          projectPicture: `${randomKey}`
        }
      });

      return NextResponse.json(newProject, { status: 201 });
    } else {
      const newProject = await prisma.projects.create({
        data: {
          projectName,
          category,
          language,
          description,
          clientId
        }
      });

      return NextResponse.json(newProject, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
