import { GET } from "@/app/api/user/[id]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("User Tests", () => {
  beforeAll(async () => {
    await prisma.users.create({
      data: {
        id: "1",
        displayName: "test",
        username: "test",
        bio: "test",
        location: "test",
        userType: "Client",
        isAdmin: false
      }
    });
  });

  afterAll(async () => {
    await prisma.users.deleteMany();
    await prisma.$disconnect();
  });

  it("should return a 404 status code", async () => {
    const requestObj = {} as any;

    const response = await GET(requestObj, { params: { id: "invalid" } });
    expect(response.status).toBe(404);
  });

  it("should return a 200 status code", async () => {
    const requestObj = {} as any;

    const response = await GET(requestObj, { params: { id: "1" } });
    expect(response.status).toBe(200);
  });
});
