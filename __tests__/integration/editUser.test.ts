import { PUT } from "@/app/api/user/[id]/edit/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Edit User Tests", () => {
  beforeAll(async () => {
    await prisma.users.create({
      data: {
        id: "edit1",
        displayName: "test",
        username: "testedit",
        bio: "test",
        location: "test",
        userType: "Client",
        isAdmin: false
      }
    });
  });

  afterAll(async () => {
    await prisma.users.deleteMany();
    await prisma.$disconnect;
    setTimeout(() => {}, 5000);
  });

  it("finds a valid user, edit profile, and return a 201 status code", async () => {
    const requestObj = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      json: async () => ({
        displayName: "editedDisplayName",
        username: "editedUsername",
        bio: "editedBio",
        location: "Philippines"
      })
    } as any;

    const response = await PUT(requestObj, { params: { id: "edit1" } });
    const { user } = await response.json();
    expect(user).toBeDefined();
    expect(response.status).toBe(201);
  });

  it("finds an invalid user and return a 401 status code", async () => {
    const requestObj = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      json: async () => ({
        displayName: "editedDisplayName",
        username: "editedUsername",
        bio: "editedBio",
        location: "Philippines"
      })
    } as any;

    const response = await PUT(requestObj, { params: { id: "invalid" } });
    expect(response.status).toBe(401);
  });
});
