import { POST, GET } from "@/app/api/project/[id]/messages/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Project Messages Tests", () => {
  jest.setTimeout(30000);

  beforeAll(async () => {
    await prisma.users.create({
      data: {
        id: "messageuser1",
        displayName: "test",
        username: "msgproj1",
        bio: "test",
        location: "test",
        userType: "Developer",
        isAdmin: false
      }
    });

    await prisma.users.create({
      data: {
        id: "messageuser2",
        displayName: "test",
        username: "msgproj2",
        bio: "test",
        location: "test",
        userType: "Client",
        isAdmin: false
      }
    });

    await prisma.projects.create({
      data: {
        id: "messageproject1",
        projectName: "test",
        category: "test",
        description: "test",
        language: "test",
        clientId: "messageuser2",
        developerId: "messageuser1"
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

    expect(response.status).toBe(404);
  });

  it("finds a valid project and gets no messages and return a 404 status code", async () => {
    const requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    const response = await GET(requestObj, {
      params: { id: "messageproject1" }
    });
    const { messages } = await response.json();

    expect(messages).toBe(null);
    expect(response.status).toBe(404);
  });

  it("finds a valid project with existing messages and return a 200 status code", async () => {
    await prisma.messages.create({
      data: {
        content: "test",
        projectId: "messageproject1",
        senderId: "messageuser1",
        type: "text"
      }
    });

    const requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    const response = await GET(requestObj, {
      params: { id: "messageproject1" }
    });
    const { formattedMessages } = await response.json();

    expect(formattedMessages).toHaveLength(1);
    expect(response.status).toBe(200);
  });

  it("creates an invalid message and return a 406 status code", async () => {
    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => ({
        userId: "messageuser1",
        content: 5,
        type: "huh"
      })
    } as any;

    const response = await POST(requestObj, {
      params: { id: "messageproject1" }
    });
    const { message } = await response.json();

    expect(message).toBe(null);
    expect(response.status).toBe(406);
  });

  it("creates an valid message and return a 201 status code", async () => {
    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => ({
        userId: "messageuser1",
        content: "hello",
        type: "text"
      })
    } as any;

    const response = await POST(requestObj, {
      params: { id: "messageproject1" }
    });
    const { message } = await response.json();

    expect(message).toBeDefined();
    expect(response.status).toBe(201);
  });
});
