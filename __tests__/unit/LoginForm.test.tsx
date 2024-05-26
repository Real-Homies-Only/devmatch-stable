import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from "@testing-library/react";
import LoginForm from "@/app/components/client/LoginForm";
import { UserType } from "@/app/utils/UserProps";
import fetchMock from "jest-fetch-mock";
import { AuthContext } from "@/app/context/AuthContext";
import { getAuth } from "@/__mocks__/firebase-auth";

jest.mock("firebase/auth");

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

describe("Login Form", () => {
  const mockUser: UserType = {
    id: "testid",
    username: "tatayness",
    userType: "client",
    location: "None",
    bio: "User has no info",
    profilePicture: "defaultPhoto.png",
    isAdmin: false,
    displayName: "mans not hot"
  };

  const mockAuth = {
    user: mockUser,
    loading: true,
    loginWithEmail: jest.fn(() => Promise.resolve(true)),
    logout: jest.fn(() => Promise.resolve(true)),
    signUpWithEmail: jest.fn(() => Promise.resolve(true))
  };

  beforeEach(() => {
    mockPush = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  it("should show the loading spinner", () => {
    render(<LoginForm />);

    const loadingSpinner = screen.getByTestId("loading");

    expect(loadingSpinner).toBeInTheDocument();
  });

  it("should redirect to home page if a user is logged in", () => {
    render(
      <AuthContext.Provider value={{ ...mockAuth, loading: false }}>
        <LoginForm />
      </AuthContext.Provider>
    );

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should render the LoginForm after loading", () => {
    render(
      <AuthContext.Provider value={{ ...mockAuth, loading: false, user: null }}>
        <LoginForm />
      </AuthContext.Provider>
    );

    const loginForm = screen.getByTestId("login-form");
    expect(loginForm).toBeInTheDocument();
  });

  it("should redirect to /register when the I don't have an account is pressed", () => {
    render(
      <AuthContext.Provider value={{ ...mockAuth, loading: false, user: null }}>
        <LoginForm />
      </AuthContext.Provider>
    );

    const helpSection = screen.getByTestId("help");
    const registerSection = within(helpSection).getByText(
      "I don't have an account"
    );
    expect(registerSection).toBeInTheDocument();

    fireEvent.click(registerSection);

    expect(mockPush).toHaveBeenCalledWith("/register");
  });

  it("should return user when credentials are valid", async () => {
    const mockAuthWithFirebase = {
      user: null,
      loading: false,
      loginWithEmail: jest.fn(),
      logout: jest.fn(() => Promise.resolve(true)),
      signUpWithEmail: jest.fn(() => Promise.resolve(true))
    };

    const mockGetAuth = getAuth();
    mockGetAuth.signInWithEmailAndPassword.mockResolvedValueOnce({
      user: mockUser
    });
    render(
      <AuthContext.Provider value={mockAuthWithFirebase}>
        <LoginForm />
      </AuthContext.Provider>
    );

    const emailInput = screen.getByPlaceholderText("email@gmail.com");
    const passwordInput = screen.getByPlaceholderText("******");
    const submitButton = screen.getByText("Log In");

    fireEvent.change(emailInput, { target: { value: "valid@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "validpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAuthWithFirebase.loginWithEmail).toHaveBeenCalledWith(
        "valid@email.com",
        "validpassword"
      );
    });
  });

  it("should show an error message when credentials are invalid", async () => {
    const mockAuthWithFirebase = {
      user: null,
      loading: false,
      loginWithEmail: jest.fn(),
      logout: jest.fn(() => Promise.resolve(true)),
      signUpWithEmail: jest.fn(() => Promise.resolve(true))
    };

    mockAuth.loginWithEmail.mockRejectedValueOnce(
      new Error("Invalid credentials")
    );

    render(
      <AuthContext.Provider value={mockAuthWithFirebase}>
        <LoginForm />
      </AuthContext.Provider>
    );

    const emailInput = screen.getByPlaceholderText("email@gmail.com");
    const passwordInput = screen.getByPlaceholderText("******");
    const submitButton = screen.getByText("Log In");

    fireEvent.change(emailInput, { target: { value: "invalid@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "invalidpassword" } });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText("Invalid email or password");
    expect(errorMessage).toBeInTheDocument();
  });
});
