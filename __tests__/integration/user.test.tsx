// /app/api/hello/route.test.ts
import { testApiHandler } from "next-test-api-route-handler"; // Must always be first
import * as appHandler from "@/app/api/user/[id]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Routes from /api/user/[id]", () => {
  beforeAll(async () => {
    await prisma.users.deleteMany();

    await prisma.users.create({
      data: {
        id: "test-id",
        username: "test-username",
        userType: "test-userType",
        displayName: "test-displayName"
      }
    });
  });

  afterAll(async () => {
    await prisma.users.deleteMany();
    await prisma.$disconnect();
  });

  it("finds a valid user and returns 200", async () => {
    await testApiHandler({
      appHandler,
      params: { id: "test-id" },
      test: async ({ fetch }) => {
        const response = await fetch({ method: "GET" });
        expect(response.status).toBe(200);
      }
    });
  });

  it("does not find a valid user and returns 404", async () => {
    await testApiHandler({
      appHandler,
      params: { id: "invalid-id" },
      test: async ({ fetch }) => {
        const response = await fetch({ method: "GET" });
        expect(response.status).toBe(404);
      }
    });
  });
});
