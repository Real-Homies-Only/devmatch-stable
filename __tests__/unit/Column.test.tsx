import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { it, describe, jest } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import Column from "@/app/components/client/Column";
import { mockProject, mockUser, mockTasks } from "@/__mocks__/kanbanMock";
import { TaskType, ColumnType } from "@/app/utils/KanbanProps";

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

beforeEach(() => {
  fetchMock.resetMocks();
  jest.spyOn(global, "fetch").mockImplementation((input, init) => {
    if (typeof input === "string" && input.startsWith("/api/project/")) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            column: "TODO" as ColumnType
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
      );
    }
    return fetch(input, init);
  });
});

describe("Column", () => {
  it("renders tasks in the Backlog column", () => {
    const setTasks = jest.fn();
    render(
      <Column
        title="Backlog"
        column="BACKLOG"
        headingColor="text-neutral-500"
        tasks={mockTasks as TaskType[]}
        userType={mockUser.userType}
        projectId={mockProject.id}
        setTasks={setTasks}
      />
    );

    const backlogTasks = mockTasks.filter((task) => task.column === "BACKLOG");
    backlogTasks.forEach(() => {
      expect(
        screen.getByTestId((content) => content.includes("task-card"))
      ).toBeInTheDocument();
    });
  });

  it("renders tasks in the Todo column", () => {
    const setTasks = jest.fn();
    render(
      <Column
        title="Todo"
        column="TODO"
        headingColor="text-neutral-500"
        tasks={mockTasks as TaskType[]}
        userType={mockUser.userType}
        projectId={mockProject.id}
        setTasks={setTasks}
      />
    );

    const todoTasks = mockTasks.filter((task) => task.column === "TODO");
    todoTasks.forEach(() => {
      expect(
        screen.getByTestId((content) => content.includes("task-card"))
      ).toBeInTheDocument();
    });
  });

  it("renders tasks in the In Progress column", () => {
    const setTasks = jest.fn();
    render(
      <Column
        title="In Progress"
        column="IN_PROGRESS"
        headingColor="text-neutral-500"
        tasks={mockTasks as TaskType[]}
        userType={mockUser.userType}
        projectId={mockProject.id}
        setTasks={setTasks}
      />
    );

    const inProgressTasks = mockTasks.filter(
      (task) => task.column === "IN_PROGRESS"
    );
    inProgressTasks.forEach(() => {
      expect(
        screen.getByTestId((content) => content.includes("task-card"))
      ).toBeInTheDocument();
    });
  });

  it("renders tasks in the Done column", () => {
    const setTasks = jest.fn();
    render(
      <Column
        title="Done"
        column="DONE"
        headingColor="text-neutral-500"
        tasks={mockTasks as TaskType[]}
        userType={mockUser.userType}
        projectId={mockProject.id}
        setTasks={setTasks}
      />
    );

    const doneTasks = mockTasks.filter((task) => task.column === "DONE");
    doneTasks.forEach(() => {
      expect(
        screen.getByTestId((content) => content.includes("task-card"))
      ).toBeInTheDocument();
    });
  });

  it("moves a task to a different column", async () => {
    const setTasks = jest.fn();
    render(
      <Column
        title="Backlog"
        column="BACKLOG"
        headingColor="text-neutral-500"
        tasks={mockTasks as TaskType[]}
        userType={mockUser.userType}
        projectId={mockProject.id}
        setTasks={setTasks}
      />
    );

    const taskToMove = mockTasks[0];
    const dataTransfer = {
      getData: jest.fn().mockReturnValue(taskToMove.id)
    };

    fireEvent.dragOver(screen.getByTestId("backlog-column"));
    fireEvent.drop(screen.getByTestId("backlog-column"), { dataTransfer });

    await waitFor(() => {
      expect(setTasks).toHaveBeenCalledWith(
        expect.objectContaining({
          column: "TODO"
        })
      );
    });
  });

  it("does not move a task for client users", async () => {
    const setTasks = jest.fn();
    render(
      <Column
        title="Backlog"
        column="BACKLOG"
        headingColor="text-neutral-500"
        tasks={mockTasks as TaskType[]}
        userType="Client"
        projectId={mockProject.id}
        setTasks={setTasks}
      />
    );

    const taskToMove = mockTasks[0];
    const dataTransfer = {
      getData: jest.fn().mockReturnValue(taskToMove.id)
    };

    fireEvent.dragOver(screen.getByTestId("backlog-column"));
    fireEvent.drop(screen.getByTestId("backlog-column"), { dataTransfer });

    await waitFor(() => {
      expect(setTasks).not.toHaveBeenCalled();
    });
  });
});
