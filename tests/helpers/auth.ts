import { Page } from "playwright/test";

export async function loginAsAdmin(page: Page) {
  await page.goto("/pages/login");
  // Click on Email/Password tab
  const emailTab = page.locator("text=Email");
  if (await emailTab.isVisible()) {
    await emailTab.click();
  }
  await page.fill(
    'input[type="email"], input[name="email"]',
    process.env.TEST_ADMIN_EMAIL || "admin@test.local"
  );
  await page.fill(
    'input[type="password"], input[name="password"]',
    process.env.TEST_ADMIN_PASSWORD || "admin123"
  );
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*/, { timeout: 10000 });
}

export async function loginAsEditor(page: Page) {
  await page.goto("/pages/login");
  const emailTab = page.locator("text=Email");
  if (await emailTab.isVisible()) {
    await emailTab.click();
  }
  await page.fill(
    'input[type="email"], input[name="email"]',
    process.env.TEST_EDITOR_EMAIL || "editor@test.local"
  );
  await page.fill(
    'input[type="password"], input[name="password"]',
    process.env.TEST_EDITOR_PASSWORD || "editor123"
  );
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*/, { timeout: 10000 });
}
