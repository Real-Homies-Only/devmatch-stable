import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { it, describe, jest } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import AddTask from "@/app/components/client/AddTask";
import {
  mockProject,
  mockUser,
  mockFetchResponses
} from "@/__mocks__/kanbanMock";
import { TaskType } from "@/app/utils/KanbanProps";

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
  jest.spyOn(global, "fetch").mockImplementation((url, options) => {
    const method = (options?.method || "GET").toUpperCase();
    const mockResponse =
      mockFetchResponses["/api/project/:projectId/kanban"]?.[method];

    if (mockResponse) {
      return Promise.resolve(
        new Response(
          JSON.stringify([
            ...mockFetchResponses["/api/project/:projectId/kanban"].GET(),
            {
              column: "BACKLOG",
              id: "new-task-id",
              title: "New Task",
              projectId: mockProject.id
            }
          ]),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
      );
    }

    return Promise.reject(new Error("Unexpected fetch call"));
  });
});

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    }
  })
}));

describe("AddTask", () => {
  it("adds a new task", async () => {
    const setTasks = jest.fn();
    render(
      <AddTask
        column="BACKLOG"
        setTasks={setTasks}
        projectId={mockProject.id}
        userType={mockUser.userType}
      />
    );

    const addTaskButton = screen.getByTestId("add-task-button");
    fireEvent.click(addTaskButton);

    const textarea = screen.getByTestId("add-task-textarea");
    fireEvent.change(textarea, { target: { value: "New Task" } });

    const submitButton = screen.getByTestId("add-task-submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(setTasks).toHaveBeenCalledWith(
        expect.arrayContaining([
          {
            column: "BACKLOG",
            id: "new-task-id",
            title: "New Task",
            projectId: mockProject.id
          } as TaskType
        ])
      );
    });
  });

  it("does not add a task with an empty title", async () => {
    const setTasks = jest.fn();

    render(
      <AddTask
        column="BACKLOG"
        setTasks={setTasks}
        projectId={mockProject.id}
        userType={mockUser.userType}
      />
    );

    const addTaskButton = screen.getByTestId("add-task-button");
    fireEvent.click(addTaskButton);

    const textarea = screen.getByTestId("add-task-textarea");
    fireEvent.change(textarea, { target: { value: "" } });

    const submitButton = screen.getByTestId("add-task-submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(setTasks).not.toHaveBeenCalled();
    });
  });

  it("does not add a task with more than 100 characters", async () => {
    const setTasks = jest.fn();

    render(
      <AddTask
        column="BACKLOG"
        setTasks={setTasks}
        projectId={mockProject.id}
        userType={mockUser.userType}
      />
    );

    const addTaskButton = screen.getByTestId("add-task-button");
    fireEvent.click(addTaskButton);

    const textarea = screen.getByTestId("add-task-textarea");
    fireEvent.change(textarea, {
      target: { value: "A".repeat(101) }
    });

    const submitButton = screen.getByTestId("add-task-submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(setTasks).not.toHaveBeenCalled();
    });
  });

  it("displays a character limit exceeded message when the limit is exceeded", async () => {
    const setTasks = jest.fn();

    render(
      <AddTask
        column="BACKLOG"
        setTasks={setTasks}
        projectId={mockProject.id}
        userType={mockUser.userType}
      />
    );

    const addTaskButton = screen.getByTestId("add-task-button");
    fireEvent.click(addTaskButton);

    const textarea = screen.getByTestId("add-task-textarea");
    fireEvent.change(textarea, {
      target: { value: "A".repeat(101) }
    });

    const submitButton = screen.getByTestId("add-task-submit-button");
    fireEvent.click(submitButton);

    const characterLimitExceededMessage = await screen.findByTestId(
      "character-limit-exceeded"
    );
    expect(characterLimitExceededMessage).toBeInTheDocument();
  });

  it("does not render the add task button for client users", () => {
    const setTasks = jest.fn();

    render(
      <AddTask
        column="BACKLOG"
        setTasks={setTasks}
        userType="Client"
        projectId={mockProject.id}
      />
    );

    expect(screen.queryByTestId("add-task-button")).not.toBeInTheDocument();
  });

  it("cancels task creation when the close button is clicked", () => {
    const setTasks = jest.fn();

    render(
      <AddTask
        column="BACKLOG"
        setTasks={setTasks}
        projectId={mockProject.id}
        userType={mockUser.userType}
      />
    );

    const addTaskButton = screen.getByTestId("add-task-button");
    fireEvent.click(addTaskButton);

    const closeButton = screen.getByTestId("add-task-close-button");
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("add-task-textarea")).not.toBeInTheDocument();
    expect(setTasks).not.toHaveBeenCalled();
  });
});
