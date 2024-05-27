import { GET } from "@/app/api/user/[id]/route";
import { UserSchema } from "@/app/utils/UserProps";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("User Profile Tests", () => {
  jest.setTimeout(30000);
  beforeAll(async () => {
    await prisma.users.create({
      data: {
        id: "foreignprofile1",
        displayName: "test",
        username: "testforeign1",
        bio: "test",
        location: "test",
        userType: "Client",
        isAdmin: false
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    setTimeout(() => {}, 5000);
  });

  it("finds an invalid user and return a 404 status code", async () => {
    const requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    const response = await GET(requestObj, { params: { id: "invalid123" } });
    const { user } = await response.json();

    expect(user).toBe(null);
    expect(response.status).toBe(404);
  });

  it("finds a valid user and return a 200 status code", async () => {
    const requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    const response = await GET(requestObj, {
      params: { id: "foreignprofile1" }
    });
    const { user } = await response.json();

    const { success } = UserSchema.safeParse(user);
    expect(success).toBe(true);
    expect(response.status).toBe(200);
  });
});
