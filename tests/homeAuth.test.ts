import { test, expect } from "@playwright/test";
import href from "./href";

test.describe("Authed home page", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(href + "/home");
  });
  test("auth home page loads", async ({ page }) => {
    const heading = page.getByRole("heading", { name: "Home" });

    await expect(heading).toBeVisible();
  });
});
