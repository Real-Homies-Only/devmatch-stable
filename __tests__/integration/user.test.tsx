import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("User", () => {
  beforeAll(async () => {
    await prisma.users.deleteMany();
  });

  afterAll(async () => {
    await prisma.users.deleteMany();
    await prisma.$disconnect();
  });
  it("should create a new user", async () => {
    await prisma.users.create({
      data: {
        id: "1asf141223569afgf",
        username: "testuser",
        userType: "Client",
        displayName: "Test User"
      }
    });

    const users = await prisma.users.findMany();
    expect(users.length).toEqual(1);
  });
});
