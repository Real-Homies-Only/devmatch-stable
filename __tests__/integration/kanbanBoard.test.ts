import { GET, POST, PATCH, DELETE } from "@/app/api/project/[id]/kanban/route";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

describe("Task Tests", () => {
  let userId: string;
  let projectId: string;

  beforeAll(async () => {
    userId = uuidv4();

    await prisma.users.create({
      data: {
        id: userId,
        displayName: "test",
        username: "test",
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
    await prisma.task.deleteMany();
    await prisma.projects.deleteMany();
    await prisma.$disconnect();
    setTimeout(() => {}, 5000);
  });

  it("returns a 200 status code and tasks for a valid project ID", async () => {
    const requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    const response = await GET(requestObj, { params: { id: projectId } });
    expect(response.status).toBe(200);
  });

  it("returns a 404 status code for an invalid project ID", async () => {
    const requestObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    } as any;

    const response = await GET(requestObj, { params: { id: "invalid" } });
    expect(response.status).toBe(404);
  });

  it("creates a new task and returns a 201 status code", async () => {
    const taskData = {
      column: "BACKLOG",
      title: "Test Task",
      projectId
    };

    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => taskData
    } as any;

    const response = await POST(requestObj);
    expect(response.status).toBe(201);
  });

  it("returns a 400 status code for an invalid task creation request", async () => {
    const taskData = {
      column: "INVALID",
      title: "Test Task",
      projectId
    };

    const requestObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => taskData
    } as any;

    const response = await POST(requestObj);
    expect(response.status).toBe(400);
  });

  it("updates a task and returns a 202 status code", async () => {
    const task = await prisma.task.create({
      data: {
        column: "BACKLOG",
        title: "Test Task",
        projectId
      }
    });

    const taskData = {
      id: task.id,
      column: "TODO",
      title: "Updated Task"
    };

    const requestObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => taskData,
      params: { id: task.id }
    } as any;

    const response = await PATCH(requestObj);
    expect(response.status).toBe(202);
  });

  it("returns a 400 status code for an invalid task update request", async () => {
    const task = await prisma.task.create({
      data: {
        column: "BACKLOG",
        title: "Test Task",
        projectId
      }
    });

    const taskData = {
      id: task.id,
      column: "INVALID",
      title: "Updated Task"
    };

    const requestObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => taskData,
      params: { id: task.id }
    } as any;

    const response = await PATCH(requestObj);
    expect(response.status).toBe(400);
  });

  it("deletes a task and returns a 200 status code", async () => {
    const task = await prisma.task.create({
      data: {
        column: "BACKLOG",
        title: "Test Task",
        projectId
      }
    });

    const requestObj = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => ({ id: task.id }),
      params: { id: task.id }
    } as any;

    const response = await DELETE(requestObj);
    expect(response.status).toBe(200);
  });

  it("returns a 400 status code for an invalid task deletion request", async () => {
    const requestObj = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      json: () => ({ id: "invalid" }),
      params: { id: "invalid" }
    } as any;

    const response = await DELETE(requestObj);
    expect(response.status).toBe(400);
  });
});
