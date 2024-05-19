import { prisma } from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucketName = process.env.BUCKET_NAME || "";
const bucketRegion = process.env.BUCKET_REGION || "";
const accessKey = process.env.AWS_ACCESS_KEY || "";
const secretKey = process.env.AWS_SECRET_KEY || "";

const s3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    secretAccessKey: secretKey,
    accessKeyId: accessKey
  }
});

export async function GET(): Promise<NextResponse> {
  try {
    const projects = await prisma.projects.findMany({
      where: {
        developerId: {
          equals: null
        }
      },
      select: {
        id: true,
        projectName: true,
        category: true,
        language: true,
        description: true,
        projectPicture: true,
        client: {
          select: {
            displayName: true
          }
        }
      }
    });

    const projectsWithSignedUrls = await Promise.all(
      projects.map(async (project) => {
        if (project.projectPicture) {
          const getObjectParams = {
            Bucket: bucketName,
            Key: project.projectPicture
          };
          const command = new GetObjectCommand(getObjectParams);
          const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600
          });
          return { ...project, projectPicture: signedUrl };
        } else {
          return project;
        }
      })
    );

    return NextResponse.json(projectsWithSignedUrls, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
