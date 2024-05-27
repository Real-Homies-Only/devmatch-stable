import { GET } from "@/app/api/user/[id]/ratings/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("User Ratings Tests", () => {
  beforeAll(async () => {
    await prisma.users.create({
      data: {
        id: "ratelist1",
        displayName: "test",
        username: "ratelist123",
        bio: "test",
        location: "test",
        userType: "Developer",
        isAdmin: false
      }
    });

    await prisma.users.create({
      data: {
        id: "ratelist2",
        displayName: "test",
        username: "ratelist321",
        bio: "test",
        location: "test",
        userType: "Client",
        isAdmin: false
      }
    });

    await prisma.users.create({
      data: {
        id: "ratelist3",
        displayName: "test",
        username: "ratelist3214",
        bio: "test",
        location: "test",
        userType: "Client",
        isAdmin: false
      }
    });

    await prisma.projects.create({
      data: {
        id: "ratedproject1",
        projectName: "test",
        category: "test",
        description: "test",
        language: "test",
        clientId: "ratelist2",
        developerId: "ratelist1",
        finished: true
      }
    });

    await prisma.projects.create({
      data: {
        id: "ratedproject2",
        projectName: "test",
        category: "test",
        description: "test",
        language: "test",
        clientId: "ratelist3",
        developerId: "ratelist1",
        finished: true
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
    const { ratings } = await response.json();

    expect(ratings).toBe(null);
    expect(response.status).toBe(404);
  });

  it("finds a valid user with no ratings and return a 404 status code", async () => {
    const requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    const response = await GET(requestObj, { params: { id: "ratelist1" } });
    const { ratings } = await response.json();

    expect(ratings).toBe(null);
    expect(response.status).toBe(404);
  });

  it("finds a valid user with ratings and return a 202 status code", async () => {
    const requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    await prisma.ratings.createMany({
      data: [
        {
          id: "rating1",
          rating: 5,
          comment: "test",
          projectId: "ratedproject1",
          userId: "ratelist1"
        },
        {
          id: "rating2",
          rating: 5,
          comment: "test",
          projectId: "ratedproject2",
          userId: "ratelist1"
        }
      ]
    });

    const response = await GET(requestObj, { params: { id: "ratelist1" } });
    const { ratings } = await response.json();

    expect(ratings).toHaveLength(2);
    expect(response.status).toBe(200);
  });
});
