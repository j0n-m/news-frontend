import { expect, test as setup } from "@playwright/test";
import href from "./href";

const pathname = "/signin";

const authFile = "playwright/.auth/user.json";

const testEmail = "test@email.com";
const testPass = "mytestpass";

setup("Auth setup", async ({ page }) => {
  await page.goto(href + pathname);
  const signInBtn = page.getByRole("button", { name: "Sign In", exact: true });
  await page.getByLabel("Email").fill(testEmail);
  await page.getByLabel("Password").fill(testPass);
  await signInBtn.click();

  await expect(
    page.getByRole("heading", { name: "Home", exact: true })
  ).toBeVisible();
  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
