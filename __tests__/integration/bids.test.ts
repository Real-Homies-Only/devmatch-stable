import { POST } from "@/app/api/bids/[id]/route";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const prisma = new PrismaClient();

describe("Bid Tests", () => {
  let userId: string;
  let projectId: string;

  beforeAll(async () => {
    userId = uuidv4();
    const username = `${crypto.randomBytes(3).toString("hex")}`; // Generate a unique username

    await prisma.users.create({
      data: {
        id: userId,
        username,
        displayName: "test",
        bio: "test",
        location: "test",
        userType: "Client",
        isAdmin: false
      }
    });

    const project = await prisma.projects.create({
      data: {
        projectName: "Test Project",
        category: "Test Category",
        language: "test language",
        description: "test description",
        clientId: userId
      }
    });

    projectId = project.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    setTimeout(() => {}, 5000);
  });

  it("creates a new bid and returns a 200 status code", async () => {
    const bidData = {
      bidComment: "Test bid comment",
      userId
    };

    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => bidData
    } as any;

    const response = await POST(requestObj, { params: { id: projectId } });
    expect(response.status).toBe(200);
  });

  it("returns a 401 status code if user already has a bid on the project", async () => {
    const bidData = {
      bidComment: "Test bid comment",
      userId
    };

    await prisma.bids.create({
      data: {
        bidComment: "Existing bid comment",
        projectId,
        userId
      }
    });

    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => bidData
    } as any;

    const response = await POST(requestObj, { params: { id: projectId } });
    expect(response.status).toBe(401);
  });

  it("returns a 404 status code for an invalid project ID", async () => {
    const bidData = {
      bidComment: "Test bid comment",
      userId
    };

    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => bidData
    } as any;

    const response = await POST(requestObj, { params: { id: "invalid" } });
    expect(response.status).toBe(404);
  });

  it("returns a 400 status code for an invalid bid creation request", async () => {
    const bidData = {
      bidComment: "",
      userId
    };

    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => bidData
    } as any;

    const response = await POST(requestObj, { params: { id: projectId } });
    expect(response.status).toBe(401);
  });
});
