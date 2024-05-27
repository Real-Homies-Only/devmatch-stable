import { GET } from "@/app/api/user/[id]/projects/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Project List Tests", () => {
  beforeAll(async () => {
    await prisma.users.create({
      data: {
        id: "testpl1",
        displayName: "test",
        username: "testpl123",
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
    const { projects } = await response.json();

    expect(projects).toBe(null);
    expect(response.status).toBe(404);
  });

  it("finds a valid user with no projects and return a 404 status code", async () => {
    const requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    const response = await GET(requestObj, { params: { id: "testpl1" } });
    const { projects } = await response.json();

    expect(projects).toBe(null);
    expect(response.status).toBe(404);
  });

  it("finds a valid user with projects and return a 202 status code", async () => {
    const requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    await prisma.projects.createMany({
      data: [
        {
          id: "project-list1",
          projectName: "test",
          category: "test",
          description: "test",
          language: "test",
          clientId: "testpl1"
        },
        {
          id: "project-list2",
          projectName: "test",
          category: "test",
          description: "test",
          language: "test",
          clientId: "testpl1"
        }
      ]
    });

    const response = await GET(requestObj, { params: { id: "testpl1" } });
    const { projects } = await response.json();

    expect(projects).toHaveLength(2);
    expect(response.status).toBe(202);
  });
});
