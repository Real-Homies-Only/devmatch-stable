import UserProfileCard from "@/app/components/client/UserProfileCard";
import { getProfilePicture } from "@/app/utils/getProfilePicture";
import { UserType } from "@/app/utils/UserProps";
import { render, screen, waitFor, within } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";

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
    },
    params: { username: "johndoe" }
  }))
}));

const getUserPicture = async (name: string) => {
  const url = await getProfilePicture(name);
  return url;
};

describe("Other User Profile", () => {
  const user: UserType = {
    id: "testid",
    displayName: "John Doe",
    username: "johndoe",
    profilePicture: "defaultPhoto.png",
    bio: "Software Engineer",
    location: "Philippines",
    userType: "Client",
    isAdmin: false
  };

  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.enableMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  it("renders loading spinner while fetching user data", async () => {
    render(<UserProfileCard />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it('renders "User not found" message for invalid profile id', async () => {
    fetchMock.mockResponse(JSON.stringify({ user: null }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ user: null })
      })
    );

    render(<UserProfileCard />);

    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument();
    });
  });

  it("renders user profile card for valid profile id", async () => {
    const url = await getUserPicture(user.profilePicture);
    const validUser = { ...user, profilePicture: url };

    fetchMock.mockResponse(JSON.stringify({ user: null }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });

    fetchMock.mockResponse(JSON.stringify({ user: null }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: validUser })
      })
    );

    render(<UserProfileCard />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    const profile = screen.getByTestId("profile");
    const displayName = within(profile).getByText("John Doe");
    const username = within(profile).getByText("@johndoe");
    const bio = within(profile).getByText("Software Engineer");
    const location = within(profile).getByText("Philippines");
    const profilePicture = screen.getByAltText("Profile Picture");

    await waitFor(() => {
      expect(screen.getByTestId("profile")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(displayName).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(username).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(bio).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(location).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(profilePicture).toBeInTheDocument();
    });
  });
});
