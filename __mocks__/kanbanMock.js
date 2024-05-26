export const mockTasks = [
  {
    id: "task-1",
    title: "Task 1",
    column: "BACKLOG",
    projectId: "project-1"
  },
  {
    id: "task-2",
    title: "Task 2",
    column: "TODO",
    projectId: "project-1"
  },
  {
    id: "task-3",
    title: "Task 3",
    column: "IN_PROGRESS",
    projectId: "project-1"
  },
  {
    id: "task-4",
    title: "Task 4",
    column: "DONE",
    projectId: "project-1"
  }
];

export const mockProject = {
  id: "project-1",
  name: "Test Project"
};

export const mockUser = {
  userType: "Developer"
};

export const mockFetchResponses = {
  "/api/project/:projectId/kanban": {
    GET: () => mockTasks,
    POST: (body) => ({ ...body, id: "new-task-id" }),
    PATCH: (body) => body,
    DELETE: (body) => ({ id: body.id })
  }
};
