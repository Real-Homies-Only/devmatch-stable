import { screen, render } from "@testing-library/react";
import { it, describe } from "@jest/globals";

import GetStarted from "@/app/components/client/GetStarted";
import Hero from "@/app/components/client/Hero";

// Mock the useRouter function outside the test cases
let mockPush: any;

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(() => ({
    asPath: "/",
    basePath: "",
    isReady: true,
    pathname: "/",
    query: {},
    push: mockPush, // Use the mockPush variable here
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

describe("Home Page", () => {
  beforeEach(() => {
    mockPush = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("has the get started text", () => {
    render(<GetStarted />);
    const getStartedButton = screen.getByRole("button", {
      name: /Get Started/i
    });
    expect(getStartedButton).toBeInTheDocument();
  });

  it("calls push when Get Started button is clicked", () => {
    render(<GetStarted />);
    const getStartedButton = screen.getByRole("button", {
      name: /Get Started/i
    });
    getStartedButton.click();

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("shows the hero section", () => {
    render(<Hero />);
    const heroTitle = screen.getByText(/Match. Create. Repeat./i);
    const heroSubtitle = screen.getByText(
      /DevMatch is a platform that simplifies the process of finding and hiring expert freelance developers and designers for projects of all sizes/i
    );
    expect(heroSubtitle).toBeInTheDocument();
    expect(heroTitle).toBeInTheDocument();
  });
});
