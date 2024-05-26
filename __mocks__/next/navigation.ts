// __mocks__/next.navigation.ts
import { jest } from "@jest/globals";

export const useRouter = jest.fn(() => ({
  asPath: "/",
  basePath: "",
  isReady: true,
  pathname: "/",
  query: {},
  push: jest.fn(), // Specify the type parameters
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
}));
