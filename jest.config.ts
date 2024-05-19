/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./"
});

const config: Config = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  testRegex: "/__tests__/.*\\.test\\.tsx$",
  transform: {
    "^.+\\.tsx?$": "@swc/jest"
  },
  verbose: true,
  forceExit: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  }
};

export default createJestConfig(config);
