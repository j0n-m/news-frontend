import { expect, test } from "@playwright/test";
import href from "./href";

const path = "/";

test.describe("Non-Auth Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(href + path);
  });
  test("Non-authed home page is loaded", async ({ page }) => {
    const getStartedLink = page.getByRole("link", { name: /get started/i });
    const signInNav = page.getByRole("link", { name: /sign in/i });

    await expect(getStartedLink).toBeVisible();
    await expect(signInNav).toBeVisible();
  });
  test("Non-authed home page links work", async ({ page }) => {
    const getStartedLink = page.getByRole("link", { name: /get started/i });
    const signInNav = page.getByRole("link", { name: /sign in/i });
    await getStartedLink.click();

    await expect(page.getByText(/Create an account/i)).toBeVisible();

    await page.goto(href + path);
    await signInNav.click();

    await expect(
      page.getByRole("button", { name: "Sign In", exact: true })
    ).toBeVisible();
  });
});
