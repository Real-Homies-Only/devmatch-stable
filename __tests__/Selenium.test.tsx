import { Builder, until, WebDriver } from "selenium-webdriver";
import "selenium-webdriver/chrome";
import "chromedriver";
import { getElementById } from "@/app/utils";
import crypto from "crypto";

const rootUrl = "http://localhost:3000";
let driver: WebDriver;

describe("Selenium Automated Test", () => {
  const email = crypto.randomBytes(6).toString("hex") + "@cpu.edu.ph";
  const password = crypto.randomBytes(6).toString("hex");

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });
  describe("Home Page", () => {
    it("have the get started text", async () => {
      await driver.get(rootUrl);
      setTimeout(() => {}, 10000);

      const getStartedButton = await getElementById("get-started", driver);
      expect(getStartedButton).toBeTruthy();
    }, 30000);

    it("redirect to /login when clicking the 'Get Started' button", async () => {
      await driver.get(rootUrl);
      setTimeout(() => {}, 10000);
      const getStartedButton = await getElementById("get-started", driver);
      await getStartedButton.click();

      await driver.wait(until.urlContains("/login"), 10000);

      const currentUrl = await driver.getCurrentUrl();

      expect(currentUrl).toContain("/login");
    }, 30000);
  });

  describe("Login, Logout, and Register", () => {
    describe("Register Page", () => {
      it("redirects to register after clicking 'Sign up Button'", async () => {
        await driver.get(rootUrl);
        setTimeout(() => {}, 10000);

        const registerButton = await getElementById("sign-up-button", driver);
        await registerButton.click();

        await driver.wait(until.urlContains("/register"), 10000);
        const currentUrl = await driver.getCurrentUrl();

        expect(currentUrl).toContain("/register");
      }, 30000);

      it("have the register form", async () => {
        const registerForm = await getElementById("register-form", driver);
        expect(registerForm).toBeTruthy();
      }, 30000);

      it("register with valid credentials", async () => {
        const displayNameInput = await getElementById("display-name", driver);
        const usernameInput = await getElementById("username", driver);
        const emailInput = await getElementById("email", driver);
        const passwordInput = await getElementById("password", driver);
        const confirmPasswordInput = await getElementById(
          "confirm-password",
          driver
        );
        const userTypeInput = await getElementById("user-type", driver);
        const developerOption = await getElementById("developer", driver);
        const submitButton = await getElementById("submit", driver);

        await displayNameInput.sendKeys(crypto.randomBytes(6).toString("hex"));
        await usernameInput.sendKeys(crypto.randomBytes(6).toString("hex"));
        await emailInput.sendKeys(email);
        await passwordInput.sendKeys(password);
        await confirmPasswordInput.sendKeys(password);
        await userTypeInput.click();
        await developerOption.click();
        await submitButton.click();

        await driver.wait(until.urlIs("http://localhost:3000/"), 10000);
      }, 30000);

      it("register with invalid credentials", async () => {
        await driver.wait(
          until.elementLocated({ id: "account-button" }),
          10000
        );
        const accountButton = await driver.findElement({
          id: "account-button"
        });
        if (accountButton) {
          await accountButton.click();

          await driver.wait(
            until.elementLocated({ id: "logout-button" }),
            5000
          );
          const logoutButton = await driver.findElement({
            id: "logout-button"
          });
          await logoutButton.click();
        }

        const registerButton = await getElementById("sign-up-button", driver);
        await registerButton.click();

        const displayNameInput = await getElementById("display-name", driver);
        const usernameInput = await getElementById("username", driver);
        const emailInput = await getElementById("email", driver);
        const passwordInput = await getElementById("password", driver);
        const confirmPasswordInput = await getElementById(
          "confirm-password",
          driver
        );
        const userTypeInput = await getElementById("user-type", driver);
        const developerOption = await getElementById("developer", driver);
        const submitButton = await getElementById("submit", driver);

        await displayNameInput.sendKeys(crypto.randomBytes(6).toString("hex"));
        await usernameInput.sendKeys(crypto.randomBytes(6).toString("hex"));
        await emailInput.sendKeys(email);
        await passwordInput.sendKeys(password);
        await confirmPasswordInput.sendKeys(password);
        await userTypeInput.click();
        await developerOption.click();
        await submitButton.click();

        const errorMessage = await getElementById("error-message", driver);
        await driver.wait(
          until.elementTextContains(errorMessage, "Email already in use!"),
          10000
        );
      }, 30000);
    });

    it("logout after clicking 'Logout Button'", async () => {
      jest.setTimeout(30000);
      await driver.get(rootUrl);
      setTimeout(() => {}, 10000);
      const loginButton = await getElementById("login-button", driver);
      await loginButton.click();

      await driver.wait(until.urlContains("/login"), 10000);
      const currentUrl = await driver.getCurrentUrl();

      expect(currentUrl).toContain("/login");

      const emailInput = await getElementById("email", driver);
      const passwordInput = await getElementById("password", driver);
      const submitButton = await getElementById("submit", driver);

      await emailInput.sendKeys(email);
      await passwordInput.sendKeys(password);
      await submitButton.click();

      setTimeout(() => {}, 5000);

      await driver.wait(until.elementLocated({ id: "account-button" }), 10000);

      const accountButton = await driver.findElement({ id: "account-button" });
      await accountButton.click();

      await driver.wait(until.elementLocated({ id: "logout-button" }), 5000);
      const logoutButton = await driver.findElement({ id: "logout-button" });
      await logoutButton.click();

      await driver.wait(until.urlIs("http://localhost:3000/"), 10000);
    }, 30000);

    describe("Login Page", () => {
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

        await emailInput.sendKeys(email);
        await passwordInput.sendKeys(password);
        await submitButton.click();

        await driver.wait(until.urlIs("http://localhost:3000/"), 10000);
      }, 30000);

      it("logins with invalid credentials", async () => {
        // logout first
        await driver.wait(
          until.elementLocated({ id: "account-button" }),
          10000
        );
        const accountButton = await driver.findElement({
          id: "account-button"
        });
        if (accountButton) {
          await accountButton.click();

          await driver.wait(
            until.elementLocated({ id: "logout-button" }),
            5000
          );
          const logoutButton = await driver.findElement({
            id: "logout-button"
          });
          await logoutButton.click();
        }

        const loginButton = await getElementById("login-button", driver);
        await loginButton.click();

        const emailInput = await getElementById("email", driver);
        const passwordInput = await getElementById("password", driver);
        const submitButton = await getElementById("submit", driver);

        await emailInput.sendKeys(email);
        await passwordInput.sendKeys("invalidpassword");
        await submitButton.click();

        const errorMessage = await getElementById("error-message", driver);
        await driver.wait(
          until.elementTextContains(errorMessage, "Invalid email or password"),
          10000
        );
      });
    });
  });

  describe("Client Automated Test", () => {});
});
