import { expect, test } from "@playwright/test";
import href from "./href";

const path = "/signin";
const testEmail = "test@email.com";
const testPass = "mytestpass";

test.describe("Sign in", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(href + path);
  });
  test("Un-auth user signs in successfully", async ({ page }) => {
    const signInBtn = page.getByRole("button", {
      name: "Sign In",
      exact: true,
    });

    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password").fill(testPass);
    await signInBtn.click();

    await expect(
      page.getByRole("heading", {
        name: "Home",
        exact: true,
      })
    ).toBeVisible();
  });
  test("Un-auth user using wrong email", async ({ page }) => {
    const signInBtn = page.getByRole("button", {
      name: "Sign In",
      exact: true,
    });

    await page.getByLabel("Email").fill("mytestfailemail@mail.com");
    await page.getByLabel("Password").fill(testPass);
    await signInBtn.click();

    await expect(signInBtn).toBeDisabled();
  });
  test("Un-auth user using wrong password", async ({ page }) => {
    const signInBtn = page.getByRole("button", {
      name: "Sign In",
      exact: true,
    });

    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password").fill("mytestfailedpassword");
    await signInBtn.click();

    await expect(signInBtn).toBeDisabled();
  });
  test("sign in as test user button works", async ({ page }) => {
    const signInAsTestBtn = page.getByRole("button", {
      name: /sign in as test user/i,
    });
    signInAsTestBtn.click();

    await expect(
      page.getByRole("heading", {
        name: "Home",
        exact: true,
      })
    ).toBeVisible();
  });
});
