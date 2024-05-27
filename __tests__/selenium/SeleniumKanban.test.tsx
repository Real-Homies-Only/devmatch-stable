import { Builder, until, WebDriver } from "selenium-webdriver";
import "selenium-webdriver/chrome";
import "chromedriver";
import { getElementById } from "@/app/utils";

const rootUrl = "http://localhost:3000";
let driver: WebDriver;

describe("Selenium Automated Tests", () => {
  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  describe("Login as a developer", () => {
    it("redirects to login after clicking 'Login Button'", async () => {
      await driver.get(rootUrl);
      setTimeout(() => {}, 10000);

      const loginButton = await getElementById("login-button", driver);
      await loginButton.click();

      await driver.wait(until.urlContains("/login"), 10000);
      const currentUrl = await driver.getCurrentUrl();

      expect(currentUrl).toContain("/login");
    }, 30000);

    it("have the login form", async () => {
      const loginForm = await getElementById("login-form", driver);
      expect(loginForm).toBeTruthy();
    }, 30000);

    it("login with valid credentials", async () => {
      const emailInput = await getElementById("email", driver);
      const passwordInput = await getElementById("password", driver);
      const submitButton = await getElementById("submit", driver);

      await emailInput.sendKeys("developer123@gmail.com");
      await passwordInput.sendKeys("123456");
      await submitButton.click();

      await driver.wait(until.urlIs("http://localhost:3000/"), 10000);
    }, 30000);
  });

  describe("Developer Projects", () => {
    it("clicks projects button and selects a project", async () => {
      await driver.wait(until.elementLocated({ id: "projects-button" }), 10000);
      const projectsButton = await driver.findElement({
        id: "projects-button"
      });

      if (projectsButton) {
        await projectsButton.click();
        await driver.wait(until.elementLocated({ id: "project-0" }), 5000);
        const sampleProjectButton = await driver.findElement({
          id: "project-0"
        });
        await sampleProjectButton.click();
      }

      await driver.wait(
        until.elementLocated({ id: "project-dashboard" }),
        15000
      );
    }, 30000);

    // it("clicks the 'Kanban Board' button", async () => {
    //   await driver.wait(until.elementLocated({ id: "project-kanban" }), 10000);
    // }, 30000);
  });
});
