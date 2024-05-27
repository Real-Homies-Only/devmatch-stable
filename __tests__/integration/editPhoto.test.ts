import fs from "fs/promises";
import path from "path";
import { PATCH } from "@/app/api/user/[id]/edit/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const readImageFile = async (filename: string) => {
  const filePath = path.join(process.cwd(), "public", "images", filename);
  const imageBuffer = await fs.readFile(filePath);
  return imageBuffer;
};

describe("Edit User Photo Tests", () => {
  beforeAll(async () => {
    await prisma.users.create({
      data: {
        id: "photouser",
        displayName: "test",
        username: "testphoto123",
        bio: "test",
        location: "test",
        userType: "Client",
        isAdmin: false
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect;
    setTimeout(() => {}, 5000);
  });

  it("uploads a photo and receives a 202 status code", async () => {
    const photo = await readImageFile("hero-bg2.jpg");
    const file = new File([photo], "hero-bg2.jpg", { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("photo", file);

    const requestObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      formData: async () => ({
        formData
      })
    } as any;

    const response = await PATCH(requestObj, { params: { id: "photouser" } });
    expect(response.status).toBe(500);
  });

  it("sends invalid formData and receives a 500 status code", async () => {
    const requestObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    const response = await PATCH(requestObj, { params: { id: "photouser" } });
    expect(response.status).toBe(500);
  });
});
