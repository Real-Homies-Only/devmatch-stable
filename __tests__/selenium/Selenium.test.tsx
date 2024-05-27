import { Builder, until, WebDriver } from "selenium-webdriver";
import "selenium-webdriver/chrome";
import "chromedriver";
import { getElementById } from "@/app/utils";
import crypto from "crypto";
import path from "path";

const rootUrl = "http://localhost:3000";
let driver: WebDriver;

describe("Selenium Automated Test", () => {
  const email = crypto.randomBytes(6).toString("hex") + "@cpu.edu.ph";
  const password = crypto.randomBytes(6).toString("hex");
  const username = crypto.randomBytes(6).toString("hex");

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
        await usernameInput.sendKeys(username);
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

  describe("Client Automated Test", () => {
    const clientEmail = "client123@gmail.com";
    const clientPassword = "123456";

    it("login as a client", async () => {
      await driver.get(rootUrl);
      setTimeout(() => {}, 10000);

      const loginButton = await getElementById("login-button", driver);
      await loginButton.click();

      await driver.wait(until.urlContains("/login"), 10000);
      const emailInput = await getElementById("email", driver);
      const passwordInput = await getElementById("password", driver);
      const submitButton = await getElementById("submit", driver);

      await emailInput.sendKeys(clientEmail);
      await passwordInput.sendKeys(clientPassword);
      await submitButton.click();

      await driver.wait(until.urlIs("http://localhost:3000/"), 10000);
    }, 30000);

    it("cancels project creation", async () => {
      await driver.wait(until.elementLocated({ id: "account-button" }), 10000);
      await driver.wait(
        until.elementLocated({ id: "create-project-button" }),
        5000
      );
      const projectsButton = await driver.findElement({
        id: "create-project-button"
      });
      await projectsButton.click();

      setTimeout(() => {}, 5000);

      await driver.wait(until.elementLocated({ id: "cancel" }), 10000);
      const cancelButton = await getElementById("cancel", driver);
      await cancelButton.click();

      await driver.wait(until.urlIs("http://localhost:3000/"), 10000);

      setTimeout(() => {}, 5000);
    }, 30000);

    it("creates a project", async () => {
      await driver.get(rootUrl);
      await driver.wait(until.elementLocated({ id: "account-button" }), 10000);
      await driver.wait(
        until.elementLocated({ id: "create-project-button" }),
        5000
      );
      const projectsButton = await driver.findElement({
        id: "create-project-button"
      });
      await projectsButton.click();

      setTimeout(() => {}, 10000);

      const photoPath = path.join(
        process.cwd(),
        "public",
        "images",
        "hero-bg2.jpg"
      );

      const photoInput = await getElementById("photo", driver);
      const titleInput = await driver.findElement({ id: "projectName" });
      const categoryInput = await driver.findElement({ id: "category" });
      const gameCategoryOption = await driver.findElement({ id: "game" });
      const languageInput = await driver.findElement({ id: "language" });
      const descriptionInput = await driver.findElement({ id: "description" });
      const submitButton = await getElementById("submit-button", driver);

      await photoInput.sendKeys(photoPath);
      await titleInput.sendKeys("Test Project");
      await categoryInput.click();
      await gameCategoryOption.click();
      await languageInput.sendKeys("TypeScript");
      await descriptionInput.sendKeys("Test Description");
      await submitButton.click();

      await driver.wait(until.urlIs("http://localhost:3000/"), 10000);
    }, 30000);

    it("opens project and accepts a bid", async () => {
      await driver.wait(until.urlIs("http://localhost:3000/"), 10000);
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

      await driver.wait(until.elementLocated({ id: "bid-0" }), 10000);
      const acceptBidButton = await driver.findElement({ id: "bid-0" });
      await acceptBidButton.click();
      const confirmButton = await getElementById("accept-bid-button", driver);
      await confirmButton.click();

      await driver.wait(
        until.elementLocated({ id: "project-dashboard" }),
        15000
      );
    }, 30000);
  });

  describe("Developer Automated Test", () => {
    const developerEmail = "developer123@gmail.com";
    const password = "123456";

    it("logs out of developer account", async () => {
      await driver.wait(until.elementLocated({ id: "account-button" }), 10000);
      const accountButton = await driver.findElement({ id: "account-button" });
      await accountButton.click();

      const logoutButtonElement = await driver.wait(
        until.elementLocated({ id: "logout-button" }),
        10000
      );
      ``;
      await driver.wait(async () => {
        const isEnabled = await logoutButtonElement.isEnabled();
        const isDisplayed = await logoutButtonElement.isDisplayed();
        return isEnabled && isDisplayed;
      }, 10000);

      await logoutButtonElement.click();
    });

    it("login as a client", async () => {
      await driver.get(rootUrl);
      setTimeout(() => {}, 10000);

      await driver.get(rootUrl);
      setTimeout(() => {}, 10000);

      const loginButton = await getElementById("login-button", driver);
      await loginButton.click();

      await driver.wait(until.urlContains("/login"), 10000);
      const emailInput = await getElementById("email", driver);
      const passwordInput = await getElementById("password", driver);
      const submitButton = await getElementById("submit", driver);

      await emailInput.sendKeys(developerEmail);
      await passwordInput.sendKeys(password);
      await submitButton.click();

      await driver.wait(until.urlIs("http://localhost:3000/"), 10000);
    }, 30000);

    it("click the browse a project button ", async () => {
      await driver.get(rootUrl);
      await driver.wait(until.elementLocated({ id: "account-button" }), 10000);
      await driver.wait(
        until.elementLocated({ id: "browse-project-button" }),
        5000
      );
      const projectsButton = await driver.findElement({
        id: "browse-project-button"
      });
      await projectsButton.click();

      await driver.wait(until.urlContains("/projects"), 10000);
    });

    it("renders project modal", async () => {
      const projectCardsContainer = await driver.wait(
        until.elementLocated({ id: "project-cards-container" }),
        10000
      );
      const firstProjectCard = await projectCardsContainer.findElement({
        id: "project-card-1"
      });
      await firstProjectCard.click();
      await driver.wait(until.elementLocated({ id: "my_modal_3" }), 10000);
      const projectModal = await driver.findElement({ id: "my_modal_3" });
      expect(await projectModal.isDisplayed()).toBe(true);
    }, 10000);

    it("clicks on bid button and navigates to bid page and submit a bid", async () => {
      const bidButton = await driver.findElement({ id: "bid-button" });
      await bidButton.click();

      const bidPageContainer = await driver.wait(
        until.elementLocated({ id: "bid-page-container" }),
        10000
      );
      expect(await bidPageContainer.isDisplayed()).toBe(true);

      const bidCommentTextarea = await bidPageContainer.findElement({
        id: "bid-comment-textarea"
      });

      const testBidComment = "Test Bid";
      await bidCommentTextarea.sendKeys(testBidComment);

      const submitButton = await bidPageContainer.findElement({
        id: "submit-bid-button"
      });
      await submitButton.click();

      const modal = await driver.wait(
        until.elementLocated({ id: "success-bid-modal" }),
        10000
      );
      expect(await modal.isDisplayed()).toBe(true);
    }, 30000);
  });

  describe("Kanban Automated Test", () => {
    describe("Developer Login", () => {
      it("logs out client account", async () => {
        await driver.wait(
          until.elementLocated({ id: "account-button" }),
          10000
        );

        const accountButton = await driver.findElement({
          id: "account-button"
        });
        await accountButton.click();

        await driver.wait(until.elementLocated({ id: "logout-button" }), 5000);
        const logoutButton = await driver.findElement({ id: "logout-button" });
        await logoutButton.click();

        await driver.wait(until.urlIs("http://localhost:3000/"), 10000);
      }, 30000);

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

      it("login as a developer with valid credentials", async () => {
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
        await driver.get(rootUrl);
        setTimeout(() => {}, 10000);

        await driver.wait(
          until.elementLocated({ id: "projects-button" }),
          10000
        );
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

      it("clicks the 'Kanban Board' button", async () => {
        await driver.wait(
          until.elementLocated({ id: "project-kanban" }),
          10000
        );
        const kanbanButton = await driver.findElement({ id: "project-kanban" });
        await kanbanButton.click();
      }, 30000);

      describe("Kanban Board", () => {
        it("does not add a task that exceeds 100 characters", async () => {
          await driver.wait(
            until.elementLocated({ id: "backlog-add-task-button" }),
            10000
          );
          const addTaskButton = await driver.findElement({
            id: "backlog-add-task-button"
          });

          await addTaskButton.click();

          await driver.wait(
            until.elementLocated({ id: "backlog-add-task-textarea" }),
            5000
          );
          const taskNameInput = await driver.findElement({
            id: "backlog-add-task-textarea"
          });
          const submitButton = await driver.findElement({
            id: "backlog-add-task-submit-button"
          });

          await taskNameInput.sendKeys(
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ma"
          );
          await submitButton.click();
          await driver.wait(
            until.elementLocated({ id: "character-limit-exceeded" }),
            5000
          );
        });

        it("cancels task creation when close button is clicked", async () => {
          await driver.wait(
            until.elementLocated({ id: "backlog-add-task-button" }),
            10000
          );
          const addTaskButton = await driver.findElement({
            id: "backlog-add-task-button"
          });

          await addTaskButton.click();

          await driver.wait(
            until.elementLocated({ id: "backlog-add-task-textarea" }),
            5000
          );
          const closeButton = await driver.findElement({
            id: "backlog-add-task-close-button"
          });
          await closeButton.click();
        });

        it("creates a task in Backlog Column", async () => {
          await driver.wait(
            until.elementLocated({ id: "backlog-column" }),
            10000
          );
          await driver.wait(
            until.elementLocated({ id: "backlog-add-task-button" }),
            10000
          );
          const addTaskButton = await driver.findElement({
            id: "backlog-add-task-button"
          });

          await addTaskButton.click();

          await driver.wait(
            until.elementLocated({ id: "backlog-add-task-textarea" }),
            5000
          );
          const taskNameInput = await driver.findElement({
            id: "backlog-add-task-textarea"
          });
          const submitButton = await driver.findElement({
            id: "backlog-add-task-submit-button"
          });

          await taskNameInput.sendKeys("Test Task");
          await submitButton.click();
        }, 30000);

        it("creates a task in TO DO Column", async () => {
          await driver.wait(until.elementLocated({ id: "todo-column" }), 10000);
          await driver.wait(
            until.elementLocated({ id: "todo-add-task-button" }),
            10000
          );
          const addTaskButton = await driver.findElement({
            id: "todo-add-task-button"
          });

          await addTaskButton.click();

          await driver.wait(
            until.elementLocated({ id: "todo-add-task-textarea" }),
            5000
          );
          const taskNameInput = await driver.findElement({
            id: "todo-add-task-textarea"
          });
          const submitButton = await driver.findElement({
            id: "todo-add-task-submit-button"
          });

          await taskNameInput.sendKeys("Test Task");
          await submitButton.click();
        }, 30000);

        it("creates a task in In Progress Column", async () => {
          await driver.wait(
            until.elementLocated({ id: "in_progress-column" }),
            10000
          );
          await driver.wait(
            until.elementLocated({ id: "in_progress-add-task-button" }),
            10000
          );
          const addTaskButton = await driver.findElement({
            id: "in_progress-add-task-button"
          });

          await addTaskButton.click();

          await driver.wait(
            until.elementLocated({ id: "in_progress-add-task-textarea" }),
            5000
          );
          const taskNameInput = await driver.findElement({
            id: "in_progress-add-task-textarea"
          });
          const submitButton = await driver.findElement({
            id: "in_progress-add-task-submit-button"
          });

          await taskNameInput.sendKeys("Test Task");
          await submitButton.click();
        }, 30000);

        it("creates a task in Done Column", async () => {
          await driver.wait(until.elementLocated({ id: "done-column" }), 10000);
          await driver.wait(
            until.elementLocated({ id: "done-add-task-button" }),
            10000
          );
          const addTaskButton = await driver.findElement({
            id: "done-add-task-button"
          });

          await addTaskButton.click();

          await driver.wait(
            until.elementLocated({ id: "done-add-task-textarea" }),
            5000
          );
          const taskNameInput = await driver.findElement({
            id: "done-add-task-textarea"
          });
          const submitButton = await driver.findElement({
            id: "done-add-task-submit-button"
          });

          await taskNameInput.sendKeys("Test Task");
          await submitButton.click();
        }, 30000);

        it("moves a task to another column", async () => {
          await driver.wait(until.elementLocated({ id: "task-0" }), 10000);
          const task = await driver.findElement({ id: "task-0" });
          const column = await driver.findElement({ id: "todo-column" });

          await driver.actions().dragAndDrop(task, column).perform();
        });

        it("deletes a task", async () => {
          await driver.wait(until.elementLocated({ id: "task-0" }), 10000);
          const task = await driver.findElement({ id: "task-0" });
          const deleteBox = await driver.findElement({ id: "delete-box" });

          await driver.actions().dragAndDrop(task, deleteBox).perform();
        }, 30000);
      });
    });
  });
});
