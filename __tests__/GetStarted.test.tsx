import { screen, render } from "@testing-library/react";
import { it, describe } from "@jest/globals";
import GetStarted from "@/app/components/client/GetStarted";

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

describe("Test", () => {
  it("have the get started text", () => {
    render(<GetStarted />);
    const getStartedButton = screen.getByRole("button", {
      name: /Get Started/i
    });
    expect(getStartedButton).toBeInTheDocument();
  });

  // it('redirects to /login when the "Get Started" button is clicked', () => {
  //   const { container } = render(<GetStarted />);
  //   const getStartedButton = screen.getByRole("button", {
  //     name: /Get Started/i
  //   });

  //   // Create a new mock function for push
  //   mockPush = jest.fn();

  //   fireEvent.click(getStartedButton);
  //   expect(mockPush).toHaveBeenCalledWith("/login");
  //   expect(container).toMatchSnapshot();
  // });
});
