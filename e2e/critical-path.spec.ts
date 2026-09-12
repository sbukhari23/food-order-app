import { test, expect } from "@playwright/test";

test("guest can browse, add to cart, and reach checkout", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Search the menu").fill("Mac");
  await expect(
    page.getByRole("heading", { name: "Mac & Cheese" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Add/ }).first().click();
  await expect(
    page.getByRole("button", { name: /Open cart, 1 item/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Account" }).click();
  await page.goto("/");
  await page.getByRole("button", { name: /Open cart/ }).click();
  await page.getByRole("link", { name: "Proceed to checkout" }).click();
  await expect(
    page.getByRole("heading", { name: "Your table is waiting." }),
  ).toBeVisible();
});

test("toast does not cover mobile header controls", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  await page.getByRole("button", { name: /Add/ }).first().click();
  await page.getByRole("button", { name: /Open cart/ }).click();
  await expect(
    page.getByRole("dialog", { name: "Shopping cart" }),
  ).toBeVisible();
});
