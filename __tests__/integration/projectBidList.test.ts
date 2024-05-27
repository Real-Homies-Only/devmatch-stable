import { GET } from "@/app/api/project/[id]/bids/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Project Bid List Tests", () => {
  beforeAll(async () => {
    await prisma.users.create({
      data: {
        id: "clientbidp1",
        displayName: "test",
        username: "clbp1",
        bio: "test",
        location: "test",
        userType: "Client",
        isAdmin: false
      }
    });

    await prisma.projects.create({
      data: {
        id: "bidlistproject1",
        projectName: "test",
        category: "test",
        description: "test",
        language: "test",
        clientId: "clientbidp1"
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    setTimeout(() => {}, 5000);
  });

  it("finds an invalid project and return a 404 status code", async () => {
    const requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    const response = await GET(requestObj, { params: { id: "invalid123" } });
    const { bidList } = await response.json();

    expect(bidList).toBe(null);
    expect(response.status).toBe(404);
  });

  it("finds a valid project with no bids and return a 404 status code", async () => {
    const requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    const response = await GET(requestObj, {
      params: { id: "bidlistproject1" }
    });
    const { bidList } = await response.json();

    expect(bidList).toBe(null);
    expect(response.status).toBe(404);
  });

  it("finds a valid project with bids and return a 200 status code", async () => {
    const requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    await prisma.users.createMany({
      data: [
        {
          id: "developerbid1",
          displayName: "test",
          username: "devbid1",
          bio: "test",
          location: "test",
          userType: "Developer",
          isAdmin: false
        },
        {
          id: "developerbid2",
          displayName: "test",
          username: "devbid2",
          bio: "test",
          location: "test",
          userType: "Developer",
          isAdmin: false
        }
      ]
    });

    await prisma.bids.createMany({
      data: [
        {
          id: "bid1",
          projectId: "bidlistproject1",
          userId: "developerbid1",
          bidComment: "test"
        },
        {
          id: "bid2",
          projectId: "bidlistproject1",
          userId: "developerbid2",
          bidComment: "test"
        }
      ]
    });

    const response = await GET(requestObj, {
      params: { id: "bidlistproject1" }
    });
    const { bidList } = await response.json();

    expect(bidList).toHaveLength(2);
    expect(response.status).toBe(200);
  });
});
