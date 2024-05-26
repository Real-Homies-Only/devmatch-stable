import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { it, describe, jest } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import DeleteBox from "@/app/components/client/DeleteBox";
import {
  mockProject,
  mockUser,
  mockFetchResponses
} from "@/__mocks__/kanbanMock";

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
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

describe("DeleteBox", () => {
  it("deletes a task", async () => {
    const setTasks = jest.fn();
    jest.spyOn(global, "fetch").mockImplementation((url, options) => {
      const method = (options?.method || "DELETE").toUpperCase();

      if (mockFetchResponses["/api/project/:projectId/kanban"]) {
        return Promise.resolve(
          new Response(
            JSON.stringify(
              mockFetchResponses["/api/project/:projectId/kanban"][method](
                options?.body
              )
            ),
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

    render(
      <DeleteBox
        data-testid="delete-box"
        setTasks={setTasks}
        projectId={mockProject.id}
        userType={mockUser.userType}
        className=""
      />
    );

    const taskToDelete = {
      id: "task-1",
      title: "Task 1",
      column: "BACKLOG",
      projectId: "project-1"
    };
    const dataTransfer = {
      getData: jest.fn().mockReturnValue(taskToDelete.id)
    };

    fireEvent.dragOver(screen.getByTestId("delete-box"));
    fireEvent.drop(screen.getByTestId("delete-box"), { dataTransfer });

    await waitFor(() => {
      expect(setTasks).toHaveBeenCalledWith(
        expect.not.arrayContaining([taskToDelete])
      );
    });
  });

  it("does not render the delete box for client users", () => {
    const setTasks = jest.fn();
    render(
      <DeleteBox
        data-testid="delete-box"
        setTasks={setTasks}
        projectId={mockProject.id}
        userType="Client"
        className=""
      />
    );

    expect(screen.queryByTestId("delete-box")).not.toBeInTheDocument();
  });

  it("renders the delete box for developer users", () => {
    const setTasks = jest.fn();
    render(
      <DeleteBox
        data-testid="delete-box"
        setTasks={setTasks}
        projectId={mockProject.id}
        userType="Developer"
        className=""
      />
    );

    expect(screen.getByTestId("delete-box")).toBeInTheDocument();
  });
});
