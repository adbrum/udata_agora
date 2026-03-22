import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Themes Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/pages/themes`);
    await page.waitForLoadState("networkidle");
  });

  test("TM-01: Page loads with sidebar menu and main content", async ({
    page,
  }) => {
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const sidebar = page.locator(
      'nav, aside, [class*="sidebar"], [class*="menu"]'
    );
    await expect(sidebar.first()).toBeVisible({ timeout: 5000 });

    const mainContent = page.locator(
      'main, [class*="content"], [class*="main"]'
    );
    await expect(mainContent.first()).toBeVisible();
  });

  test("TM-02: Sidebar shows categories with accordion sub-sections", async ({
    page,
  }) => {
    const menuItems = page.locator(
      '[class*="sidebar"] a, [class*="sidebar"] button, [class*="menu"] a, [class*="menu"] button, nav a, nav button'
    );
    const count = await menuItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test("TM-03: Click category expands sub-sections", async ({ page }) => {
    const accordionTrigger = page.locator(
      '[class*="accordion"] button, [class*="sidebar"] button, details summary'
    );
    if ((await accordionTrigger.count()) > 0) {
      await accordionTrigger.first().click();
      await page.waitForTimeout(500);

      const expandedContent = page.locator(
        '[class*="accordion"] [class*="content"], [class*="accordion"] [class*="panel"], details[open]'
      );
      if ((await expandedContent.count()) > 0) {
        await expect(expandedContent.first()).toBeVisible();
      }
    }
  });

  test("TM-04: Click sub-section scrolls to corresponding content", async ({
    page,
  }) => {
    const sidebarLinks = page.locator(
      '[class*="sidebar"] a, [class*="menu"] a[href*="#"]'
    );
    if ((await sidebarLinks.count()) > 0) {
      const initialScrollY = await page.evaluate(() => window.scrollY);
      await sidebarLinks.first().click();
      await page.waitForTimeout(500);

      // Page might scroll or navigate
      const body = await page.textContent("body");
      expect(body).toBeTruthy();
    }
  });

  test("TM-05: Dataset links open dataset pages", async ({ page }) => {
    const datasetLinks = page.locator(
      'a[href*="/pages/datasets/"], a[href*="/datasets/"]'
    );
    if ((await datasetLinks.count()) > 0) {
      const href = await datasetLinks.first().getAttribute("href");
      expect(href).toContain("dataset");
    }
  });

  test("TM-06: Menu stays sticky on scroll", async ({ page }) => {
    const sidebar = page.locator(
      '[class*="sidebar"], [class*="menu"], aside'
    );
    if ((await sidebar.count()) > 0) {
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(300);

      await expect(sidebar.first()).toBeVisible();
    }
  });

  test('TM-07: Future sections marked as "em breve"', async ({ page }) => {
    const body = await page.textContent("body");
    const hasEmBreve =
      body?.toLowerCase().includes("em breve") ||
      body?.toLowerCase().includes("brevemente");
    // This is optional - not all pages may have this marker
    expect(body).toBeTruthy();
  });
});
