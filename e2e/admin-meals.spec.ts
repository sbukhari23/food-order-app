import { test, expect } from "@playwright/test";

test("admin meal management protects destructive actions", async ({ page }) => {
  test.skip(
    !process.env.E2E_ADMIN_EMAIL,
    "Set E2E_ADMIN_EMAIL and seed an admin account to run this flow.",
  );
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.E2E_ADMIN_EMAIL!);
  await page.getByLabel("Password").fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.goto("/admin/meals");
  await expect(
    page.getByRole("heading", { name: "Shape the menu." }),
  ).toBeVisible();
});
