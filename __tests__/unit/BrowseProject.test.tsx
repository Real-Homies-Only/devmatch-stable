import { screen, render } from "@testing-library/react";
import { it, describe, beforeEach } from "@jest/globals";
import BrowseProject from "@/app/components/client/BrowseProject";
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
  userType: "Developer",
  isAdmin: false
};

const mockAuth = {
  user: mockUser,
  loading: false,
  loginWithEmail: jest.fn(() => Promise.resolve(true)),
  logout: jest.fn(() => Promise.resolve(true)),
  signUpWithEmail: jest.fn(() => Promise.resolve(true))
};

describe("BrowseProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  it("renders loading spinner", () => {
    render(
      <AuthContext.Provider value={{ ...mockAuth, loading: true }}>
        <BrowseProject />
      </AuthContext.Provider>
    );
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it('renders "No projects" message when there are no projects', async () => {
    fetchMock.mockResponse(JSON.stringify([]));
    global.fetch = jest.fn().mockImplementation(() => Response);

    render(
      <AuthContext.Provider value={mockAuth}>
        <BrowseProject />
      </AuthContext.Provider>
    );

    expect(
      await screen.findByTestId("no-projects-message")
    ).toBeInTheDocument();
  });

  it("renders project cards", async () => {
    const mockProjects = [
      {
        id: "1",
        projectName: "project 1",
        category: "web development",
        language: "js",
        description: " test project",
        projectPicture: "https://example.com/project1.jpg",
        client: { displayName: "Client 1" }
      }
    ];

    fetchMock.mockResponse(JSON.stringify(mockProjects), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProjects)
      })
    );

    render(
      <AuthContext.Provider value={mockAuth}>
        <BrowseProject />
      </AuthContext.Provider>
    );

    expect(await screen.findByTestId("project-card-1")).toBeInTheDocument();
  });

  it("opens project modal when project a is clicked", async () => {
    const mockProjects = [
      {
        id: "1",
        projectName: "project 1",
        category: "game development",
        language: "java",
        description: "test project",
        projectPicture: "https://example.com/project1.jpg",
        client: { displayName: "Client 1" }
      }
    ];
    fetchMock.mockResponse(JSON.stringify(mockProjects), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProjects)
      })
    );

    render(
      <AuthContext.Provider value={mockAuth}>
        <BrowseProject />
      </AuthContext.Provider>
    );

    const projectCard = await screen.findByTestId("project-card-1");
    projectCard.click();

    await screen.findByTestId("project-modal");
  });

  it("navigates to bid page when bid button is clicked", async () => {
    const mockProjects = [
      {
        id: "1",
        projectName: "project 1",
        category: "mobile application",
        language: "c++",
        description: "test project",
        projectPicture: "https://example.com/project1.jpg",
        client: { displayName: "Client 1" }
      }
    ];
    fetchMock.mockResponse(JSON.stringify(mockProjects), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProjects)
      })
    );
    mockPush = jest.fn();

    render(
      <AuthContext.Provider value={mockAuth}>
        <BrowseProject />
      </AuthContext.Provider>
    );

    const projectCard = await screen.findByTestId("project-card-1");
    projectCard.click();

    const bidButton = await screen.findByTestId("bid-button");
    bidButton.click();

    expect(mockPush).toHaveBeenCalledWith(
      `/projects/bid?projectId=1&developerId=1`
    );
  });
});
