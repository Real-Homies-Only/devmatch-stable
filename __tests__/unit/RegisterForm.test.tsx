import React from "react";
import {
  screen,
  render,
  within,
  fireEvent,
  waitFor
} from "@testing-library/react";
import RegisterForm from "@/app/components/client/RegisterForm";
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

describe("Register Form", () => {
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

  it("should render the register form", () => {
    render(
      <AuthContext.Provider value={{ ...mockAuth, loading: false, user: null }}>
        <RegisterForm />
      </AuthContext.Provider>
    );

    const form = screen.getByTestId("register-form");
    expect(form).toBeInTheDocument();
  });

  it("should redirect to the home page if user exists", async () => {
    mockPush = jest.fn();
    render(
      <AuthContext.Provider value={{ ...mockAuth, loading: false }}>
        <RegisterForm />
      </AuthContext.Provider>
    );

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should redirect to /login when I press 'I already have an account'", async () => {
    mockPush = jest.fn();
    render(
      <AuthContext.Provider value={{ ...mockAuth, user: null, loading: false }}>
        <RegisterForm />
      </AuthContext.Provider>
    );

    const buttonsSection = screen.getByTestId("buttons");
    const loginLink = within(buttonsSection).getByText(
      "I already have an account"
    );
    expect(loginLink).toBeInTheDocument();

    loginLink.click();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("should have all inputs present", async () => {
    render(
      <AuthContext.Provider value={{ ...mockAuth, loading: false, user: null }}>
        <RegisterForm />
      </AuthContext.Provider>
    );

    const displayNameInput = screen.getByPlaceholderText("AJ Aparicio");
    const usernameInput = screen.getByPlaceholderText("aj.aparicio36");
    const emailInput = screen.getByPlaceholderText("email@gmail.com");
    const passwordAndConfirmPassword = screen.getAllByPlaceholderText("******");
    const passwordInput = passwordAndConfirmPassword[0];
    const confirmPasswordInput = passwordAndConfirmPassword[1];
    const userTypeSelect = screen.getByTestId("user-type");
    const submitButton = screen.getByText("Register");

    expect(displayNameInput).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(userTypeSelect).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  describe("Register Form Firebase Functions", () => {
    const mockAuthWithFirebase = {
      user: null,
      loading: false,
      loginWithEmail: jest.fn(),
      logout: jest.fn(() => Promise.resolve(true)),
      signUpWithEmail: jest.fn()
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should redirect to '/' when valid credentials are submitted", async () => {
      const mockPush = jest.fn();
      jest.mock("next/navigation", () => ({
        useRouter: jest.fn(() => ({
          push: mockPush
        }))
      }));

      const mockGetAuth = getAuth();
      mockGetAuth.createUserWithEmailAndPassword.mockResolvedValueOnce({
        user: mockUser
      });
      mockAuthWithFirebase.signUpWithEmail.mockResolvedValueOnce(true);

      render(
        <AuthContext.Provider value={mockAuthWithFirebase}>
          <RegisterForm />
        </AuthContext.Provider>
      );

      const displayNameInput = screen.getByPlaceholderText("AJ Aparicio");
      const usernameInput = screen.getByPlaceholderText("aj.aparicio36");
      const emailInput = screen.getByPlaceholderText("email@gmail.com");
      const passwordAndConfirmPassword =
        screen.getAllByPlaceholderText("******");
      const passwordInput = passwordAndConfirmPassword[0];
      const confirmPasswordInput = passwordAndConfirmPassword[1];
      const userTypeSelect = screen.getByTestId("user-type");
      const submitButton = screen.getByText("Register");

      fireEvent.change(displayNameInput, { target: { value: "John Doe" } });
      fireEvent.change(usernameInput, { target: { value: "johndoe" } });
      fireEvent.change(emailInput, { target: { value: "valid@email.com" } });
      fireEvent.change(passwordInput, { target: { value: "validpassword" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "validpassword" }
      });
      fireEvent.change(userTypeSelect, { target: { value: "Developer" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAuthWithFirebase.signUpWithEmail).toHaveBeenCalledWith(
          "John Doe",
          "johndoe",
          "Developer",
          "valid@email.com",
          "validpassword"
        );
      });
    });

    it("should show errors when invalid values are entered", async () => {
      render(
        <AuthContext.Provider value={mockAuthWithFirebase}>
          <RegisterForm />
        </AuthContext.Provider>
      );

      const displayNameInput = screen.getByPlaceholderText("AJ Aparicio");
      const usernameInput = screen.getByPlaceholderText("aj.aparicio36");
      const emailInput = screen.getByPlaceholderText("email@gmail.com");
      const passwordAndConfirmPassword =
        screen.getAllByPlaceholderText("******");
      const passwordInput = passwordAndConfirmPassword[0];
      const confirmPasswordInput = passwordAndConfirmPassword[1];
      const userTypeSelect = screen.getByTestId("user-type");
      const submitButton = screen.getByText("Register");

      fireEvent.change(displayNameInput, { target: { value: "J" } });
      fireEvent.change(usernameInput, { target: { value: "abc" } });
      fireEvent.change(emailInput, { target: { value: "invalid" } });
      fireEvent.change(passwordInput, { target: { value: "notshort" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "notshort" } });
      fireEvent.change(userTypeSelect, { target: { value: "" } });
      fireEvent.click(submitButton);

      fireEvent.change(displayNameInput, { target: { value: "asdasd" } });
      fireEvent.change(usernameInput, { target: { value: "" } });
      fireEvent.change(emailInput, { target: { value: "" } });
      fireEvent.change(passwordInput, { target: { value: "" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "" } });
      fireEvent.change(userTypeSelect, { target: { value: "" } });
      fireEvent.click(submitButton);

      fireEvent.change(displayNameInput, { target: { value: "J" } });
      fireEvent.change(usernameInput, { target: { value: "abc" } });
      fireEvent.change(emailInput, { target: { value: "invalid" } });
      fireEvent.change(passwordInput, { target: { value: "short" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "mismatch" } });
      fireEvent.change(userTypeSelect, { target: { value: "" } });
      fireEvent.click(submitButton);

      const displayNameError = await waitFor(() =>
        screen.findByText("Display name should be more than 2 characters")
      );
      const usernameError = await waitFor(() =>
        screen.findByText("Username should be more than 4 characters")
      );
      const emailError = await waitFor(() =>
        screen.findByText("Invalid email address")
      );
      const passwordError = await waitFor(() =>
        screen.findByText("Password should be at least 6 characters")
      );

      const userTypeError = await waitFor(() =>
        screen.findByText("Please select a user type")
      );

      expect(displayNameError).toBeInTheDocument();
      expect(usernameError).toBeInTheDocument();
      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
      expect(userTypeError).toBeInTheDocument();

      fireEvent.change(displayNameInput, { target: { value: "John Doe" } });
      fireEvent.change(usernameInput, { target: { value: "johndoe" } });
      fireEvent.change(emailInput, { target: { value: "valid@email.com" } });
      fireEvent.change(passwordInput, { target: { value: "asdasd123" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "asdasd456" }
      });
      fireEvent.change(userTypeSelect, { target: { value: "Developer" } });
      fireEvent.click(submitButton);

      const confirmPasswordError = await waitFor(() =>
        screen.findByText("Passwords do not match")
      );

      expect(confirmPasswordError).toBeInTheDocument();
    });
  });
});
