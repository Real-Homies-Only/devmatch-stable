import { POST } from "@/app/api/project/[id]/rate/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Project Rate Tests", () => {
  jest.setTimeout(30000);
  beforeAll(async () => {
    await prisma.users.create({
      data: {
        id: "rateproject1",
        displayName: "test",
        username: "rateproj12344",
        bio: "test",
        location: "test",
        userType: "Developer",
        isAdmin: false
      }
    });

    await prisma.users.create({
      data: {
        id: "rateproject2",
        displayName: "test",
        username: "rateproj1",
        bio: "test",
        location: "test",
        userType: "Client",
        isAdmin: false
      }
    });

    await prisma.projects.create({
      data: {
        id: "ratingproject1",
        projectName: "test",
        category: "test",
        description: "test",
        language: "test",
        clientId: "rateproject2",
        developerId: "rateproject1",
        finished: true
      }
    });

    await prisma.projects.create({
      data: {
        id: "ratingproject2",
        projectName: "test",
        category: "test",
        description: "test",
        language: "test",
        clientId: "rateproject2",
        developerId: "rateproject1",
        finished: true
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    setTimeout(() => {}, 5000);
  });

  it("finds an invalid project and return a 404 status code", async () => {
    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => ({
        rate: 5,
        comment: "yep",
        userId: "rateproject1"
      })
    } as any;

    const response = await POST(requestObj, { params: { id: "invalid123" } });

    expect(response.status).toBe(404);
  });

  it("finds a valid project and creates invalid rating and return a 400 status code", async () => {
    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => ({
        rate: "yep",
        comment: 5,
        projectId: "ratingproject1"
      })
    } as any;

    const response = await POST(requestObj, {
      params: { id: "ratingproject1" }
    });
    const { rating } = await response.json();

    expect(rating).toBe(null);
    expect(response.status).toBe(400);
  });

  it("finds a valid project with existing rating and return a 401 status code", async () => {
    await prisma.ratings.create({
      data: {
        id: "rating123",
        rating: 5,
        comment: "test",
        projectId: "ratingproject1",
        userId: "rateproject1"
      }
    });

    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => ({
        rate: "yep",
        comment: 5,
        projectId: "ratingproject1"
      })
    } as any;

    const response = await POST(requestObj, {
      params: { id: "ratingproject1" }
    });
    expect(response.status).toBe(401);
  });

  it("creates a valid rating and return a 201 status code", async () => {
    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => ({
        rate: 5,
        comment: "good",
        userId: "rateproject1",
        projectId: "ratingproject2"
      })
    } as any;

    const response = await POST(requestObj, {
      params: { id: "ratingproject2" }
    });
    const { rating } = await response.json();

    expect(rating).toBeDefined();
    expect(response.status).toBe(201);
  });
});
