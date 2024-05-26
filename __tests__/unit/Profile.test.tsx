import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from "@testing-library/react";
import ProfileCard from "@/app/components/client/ProfileCard";
import { UserType } from "@/app/utils/UserProps";
import { AuthContext } from "@/app/context/AuthContext";
import { getProfilePicture } from "@/app/utils/getProfilePicture";
import fetchMock from "jest-fetch-mock";

jest.mock("firebase/auth");

fetchMock.enableMocks();

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

describe("User Profile", () => {
  const mockUser: UserType = {
    id: "testid",
    username: "tatayness",
    userType: "Client",
    location: "None",
    bio: "User has no info",
    profilePicture: "defaultPhoto.png",
    isAdmin: false,
    displayName: "mans not hot"
  };

  const mockAuth = {
    user: mockUser,
    loading: false,
    loginWithEmail: jest.fn(() => Promise.resolve(true)),
    logout: jest.fn(() => Promise.resolve(true)),
    signUpWithEmail: jest.fn(() => Promise.resolve(true))
  };

  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  it("should render the profile card with sample user data", async () => {
    const defaultPhotoURL = await getProfilePicture("defaultPhoto.png");

    const mockUserWithProfilePicture: UserType = {
      ...mockUser,
      profilePicture: defaultPhotoURL
    };

    render(
      <AuthContext.Provider
        value={{ ...mockAuth, user: mockUserWithProfilePicture }}
      >
        <ProfileCard />
      </AuthContext.Provider>
    );

    const profileCard = screen.getByTestId("profile");
    const profileCardUsername = within(profileCard).getByText("@tatayness");
    const profileCardDisplayname =
      within(profileCard).getByText("mans not hot");
    const profileCardPicture = screen.getByTestId("profile-picture");
    const profileCardUserType = within(profileCard).getByText("Client");
    const profileCardBio = within(profileCard).getByText("User has no info");
    const profileCardLocation = within(profileCard).getByText("None");

    expect(profileCardDisplayname).toHaveTextContent("mans not hot");
    expect(profileCardUsername).toHaveTextContent("@tatayness");
    expect(profileCardPicture).toHaveAttribute("alt", "Profile Picture");
    expect(profileCardUserType).toHaveTextContent("Client");
    expect(profileCardBio).toHaveTextContent("User has no info");
    expect(profileCardLocation).toHaveTextContent("None");
  });

  it("should click the edit form and render all edit fields", async () => {
    const defaultPhotoURL = await getProfilePicture("defaultPhoto.png");

    const mockUserWithProfilePicture: UserType = {
      ...mockUser,
      profilePicture: defaultPhotoURL
    };

    render(
      <AuthContext.Provider
        value={{ ...mockAuth, user: mockUserWithProfilePicture }}
      >
        <ProfileCard />
      </AuthContext.Provider>
    );

    const profile = screen.getByTestId("profile");
    const editButton = within(profile).getByText("Edit Profile");
    fireEvent.click(editButton);

    const editForm = screen.getByRole("form");
    const editDisplayName = within(editForm).getByTestId("display-name");
    const editUsername = within(editForm).getByTestId("username");
    const editLocation = within(editForm).getByTestId("location");
    const editBio = within(editForm).getByTestId("bio");

    await waitFor(() => {
      expect(editForm).toBeInTheDocument();
    });
    expect(editDisplayName).toBeInTheDocument();
    expect(editUsername).toBeInTheDocument();
    expect(editLocation).toBeInTheDocument();
    expect(editBio).toBeInTheDocument();
  });

  it("should click the edit form and input valid information", async () => {
    const defaultPhotoURL = await getProfilePicture("defaultPhoto.png");

    const mockUserWithProfilePicture: UserType = {
      ...mockUser,
      profilePicture: defaultPhotoURL
    };

    render(
      <AuthContext.Provider
        value={{ ...mockAuth, user: mockUserWithProfilePicture }}
      >
        <ProfileCard />
      </AuthContext.Provider>
    );

    const profile = screen.getByTestId("profile");
    const editButton = within(profile).getByText("Edit Profile");
    fireEvent.click(editButton);

    const editForm = screen.getByRole("form");
    const editDisplayName = within(editForm).getByTestId("display-name");
    const editUsername = within(editForm).getByTestId("username");
    const editLocation = within(editForm).getByTestId("location");
    const editBio = within(editForm).getByTestId("bio");
    const submitButton = within(editForm).getByRole("button");

    fetchMock.mockResponses([
      JSON.stringify({ success: true }),
      { status: 201 }
    ]);

    fireEvent.change(editDisplayName, {
      target: { value: "new display name" }
    });
    fireEvent.change(editUsername, { target: { value: "newusername" } });
    fireEvent.change(editLocation, { target: { value: "Philippines" } });
    fireEvent.change(editBio, { target: { value: "new bio" } });
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await new Promise(process.nextTick);

    expect(fetchMock.mock.calls.length).toBe(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/user/testid/edit");
    if (fetchMock.mock.calls[0][1]) {
      expect(fetchMock.mock.calls[0][1].method).toBe("PUT");
    }
  });

  it("should display error messages for invalid input", async () => {
    const defaultPhotoURL = await getProfilePicture("defaultPhoto.png");

    const mockUserWithProfilePicture: UserType = {
      ...mockUser,
      profilePicture: defaultPhotoURL
    };

    render(
      <AuthContext.Provider
        value={{ ...mockAuth, user: mockUserWithProfilePicture }}
      >
        <ProfileCard />
      </AuthContext.Provider>
    );

    const profile = screen.getByTestId("profile");
    const editButton = within(profile).getByText("Edit Profile");
    fireEvent.click(editButton);

    const editForm = screen.getByRole("form");
    const editDisplayName = within(editForm).getByTestId("display-name");
    const editUsername = within(editForm).getByTestId("username");
    const editLocation = within(editForm).getByTestId("location");
    const editBio = within(editForm).getByTestId("bio");
    const submitButton = within(editForm).getByRole("button");

    fireEvent.change(editDisplayName, { target: { value: "A" } });
    fireEvent.change(editUsername, { target: { value: "abc" } });
    fireEvent.change(editBio, { target: { value: "nah" } });
    fireEvent.change(editLocation, { target: { value: "" } });
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const displayNameError = screen.getByText(
      "String must contain at least 2 character(s)"
    );
    const usernameError = screen.getByText(
      "Username should be more than 4 characters"
    );
    const bioError = screen.getByText(
      "Bio must at least be 5 characters long!"
    );

    const locationError = screen.getByText("Please select a valid location");

    expect(displayNameError).toBeInTheDocument();
    expect(usernameError).toBeInTheDocument();
    expect(bioError).toBeInTheDocument();
    expect(locationError).toBeInTheDocument();
  });
});
