import { Builder, WebDriver } from "selenium-webdriver";
import "selenium-webdriver/chrome";
import "chromedriver";
import { getElementById } from "@/app/utils";

const rootUrl = "http://localhost:3000";
let driver: WebDriver;

describe("Selenium Test", () => {
  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("initializes the driver", async () => {
    await driver.get(rootUrl);
  });

  it("should have the get started text", async () => {
    jest.setTimeout(30000); // Set a 30-second timeout for this test case

    await driver.get(rootUrl);
    setTimeout(() => {}, 3000); // Wait for the page to load

    const getStartedButton = await getElementById("get-started", driver);
    expect(getStartedButton).toBeTruthy();
  }, 30000); // Set a 30-second timeout for this test case
});
