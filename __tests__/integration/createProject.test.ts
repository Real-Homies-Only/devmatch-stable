import fs from "fs/promises";
import path from "path";
import { POST } from "@/app/api/project/route";
import { prisma } from "@/app/utils/prisma";

describe("POST /api/project", () => {
  const readImageFile = async (filename: string) => {
    const filePath = path.join(process.cwd(), "public", "images", filename);
    const imageBuffer = await fs.readFile(filePath);
    return imageBuffer;
  };

  beforeAll(async () => {
    await prisma.users.create({
      data: {
        id: "client-id",
        displayName: "Test Client",
        username: "clienttest69",
        bio: "Test Client User",
        location: "Test Location",
        userType: "Client",
        isAdmin: false
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new project with photo", async () => {
    const clientId = "client-id";
    const projectName = "test project";
    const category = "mobile application";
    const language = "javascript";
    const description = "this is test ha";
    const photo = await readImageFile("hero-bg2.jpg");
    const file = new File([photo], "hero-bg2.jpg", { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("clientId", clientId);
    formData.append("projectName", projectName);
    formData.append("category", category);
    formData.append("language", language);
    formData.append("description", description);
    formData.append("photo", file);

    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      formData: async () => formData
    } as any;

    const response = await POST(requestObj);

    expect(response.status).toBe(201);
  });

  it("sumbit incomplete form and throw an 404", async () => {
    const clientId = "testclient";
    const category = "mobile application";
    const language = "javascript";
    const description = "this is test ha";
    const photo = await readImageFile("hero-bg2.jpg");
    const file = new File([photo], "hero-bg2.jpg", { type: "image/jpeg" });
    const formData = new FormData();

    formData.append("clientId", clientId);
    formData.append("category", category);
    formData.append("language", language);
    formData.append("description", description);
    formData.append("photo", file);

    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      formData: async () => formData
    } as any;

    const response = await POST(requestObj);

    const { error } = await response.json();
    expect(error).toBeDefined();
    expect(response.status).toBe(404);
  });
});
