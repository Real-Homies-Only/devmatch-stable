import { screen, render, fireEvent, within } from "@testing-library/react";
import { it, describe, beforeEach } from "@jest/globals";
import CreateProject from "@/app/components/client/CreateProject";
import { AuthContext } from "@/app/context/AuthContext";
import { UserInterface } from "@/app/utils/UserProps";
import fetchMock from "jest-fetch-mock";

afterEach(() => {
  fetchMock.resetMocks();
});

let mockPush: any;
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(() => ({
    asPath: "/",
    basePath: "",
    isReady: true,
    pathname: "/",
    query: {},
    push: mockPush,
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
  }))
}));

const mockUser: UserInterface = {
  id: "1",
  displayName: "Zyd Reic",
  username: "Acespiker09",
  profilePicture: "iamtheacespiker.jpg",
  bio: "huhh",
  location: "Africa",
  userType: "Client",
  isAdmin: false
};

const mockAuth = {
  user: mockUser,
  loading: false,
  loginWithEmail: jest.fn(() => Promise.resolve(true)),
  logout: jest.fn(() => Promise.resolve(true)),
  signUpWithEmail: jest.fn(() => Promise.resolve(true))
};

describe("CreateProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  it("renders the form when user is a client", () => {
    render(
      <AuthContext.Provider value={mockAuth}>
        <CreateProject />
      </AuthContext.Provider>
    );
    expect(screen.getByTestId("project-name")).toBeInTheDocument();
    expect(screen.getByTestId("category")).toBeInTheDocument();
    expect(screen.getByTestId("language")).toBeInTheDocument();
    expect(screen.getByTestId("description")).toBeInTheDocument();
  });

  it("submits the form and shows success modal", async () => {
    fetchMock.mockResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

    render(
      <AuthContext.Provider value={mockAuth}>
        <CreateProject />
      </AuthContext.Provider>
    );
    const putPicure = screen.getByTestId("photo");
    const projectNameInput = screen.getByTestId("project-name");
    const categorySelect = screen.getByTestId("category");
    const languageInput = screen.getByTestId("language");
    const descriptionInput = screen.getByTestId("description");
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.change(putPicure, { target: { value: "" } });
    fireEvent.change(projectNameInput, { target: { value: "Test Project" } });
    fireEvent.change(categorySelect, { target: { value: "web" } });
    fireEvent.change(languageInput, { target: { value: "JavaScript" } });
    fireEvent.change(descriptionInput, {
      target: { value: "This is a test project." }
    });
    fireEvent.click(submitButton);

    const modal = await screen.findByRole("modal-info");

    expect(modal).toBeInTheDocument();
  });

  it("fails to create project", async () => {
    fetchMock.mockResponse(
      JSON.stringify({ error: "Failed to create project" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );

    render(
      <AuthContext.Provider value={mockAuth}>
        <CreateProject />
      </AuthContext.Provider>
    );
    const projectNameInput = screen.getByTestId("project-name");
    const categorySelect = screen.getByTestId("category");
    const languageInput = screen.getByTestId("language");
    const descriptionInput = screen.getByTestId("description");
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.change(projectNameInput, { target: { value: "helo" } });
    fireEvent.change(categorySelect, { target: { value: "web" } });
    fireEvent.change(languageInput, { target: { value: "JavaScript" } });
    fireEvent.change(descriptionInput, {
      target: { value: "This is a test project." }
    });
    fireEvent.click(submitButton);

    const modal = await screen.findByText("An error occurred");
    expect(modal).toBeInTheDocument();
  });
  it("does not render form for non-client users", () => {
    const mockDeveloperUser: UserInterface = {
      ...mockUser,
      userType: "Developer"
    };

    const mockAuthWithDeveloper = {
      ...mockAuth,
      user: mockDeveloperUser
    };

    render(
      <AuthContext.Provider value={mockAuthWithDeveloper}>
        <CreateProject />
      </AuthContext.Provider>
    );

    expect(screen.queryByTestId("project-name")).not.toBeInTheDocument();
    expect(screen.queryByTestId("category")).not.toBeInTheDocument();
    expect(screen.queryByTestId("language")).not.toBeInTheDocument();
    expect(screen.queryByTestId("description")).not.toBeInTheDocument();
  });
});

it("navigates back to home when 'Back to Home' button is clicked", async () => {
  mockPush = jest.fn();

  render(
    <AuthContext.Provider value={mockAuth}>
      <CreateProject />
    </AuthContext.Provider>
  );

  const putPicture = screen.getByTestId("photo");
  const projectNameInput = screen.getByTestId("project-name");
  const categorySelect = screen.getByTestId("category");
  const languageInput = screen.getByTestId("language");
  const descriptionInput = screen.getByTestId("description");
  const submitButton = screen.getByTestId("submit-button");

  fireEvent.change(putPicture, { target: { value: "" } });
  fireEvent.change(projectNameInput, { target: { value: "Test Project" } });
  fireEvent.change(categorySelect, { target: { value: "web" } });
  fireEvent.change(languageInput, { target: { value: "JavaScript" } });
  fireEvent.change(descriptionInput, {
    target: { value: "This is a test project." }
  });
  fireEvent.click(submitButton);

  const modal = await screen.findByRole("modal-info");

  const backToHomeButton = await within(modal).findByTestId(
    "back-to-home-button"
  );
  fireEvent.click(backToHomeButton);

  expect(mockPush).toHaveBeenCalledWith("/");
});
