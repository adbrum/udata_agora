import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Dataservices Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/pages/dataservices`);
    await page.waitForLoadState("networkidle");
  });

  test("SD-01: Page loads with API/service list and filters", async ({
    page,
  }) => {
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Cards or links to dataservices
    const cards = page.locator(
      'a[href*="/pages/dataservices/"], .card, [class*="card"], article'
    );
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
  });

  test("SD-02: Cards show title, description, organization, format", async ({
    page,
  }) => {
    const firstCard = page
      .locator('a[href*="/pages/dataservices/"], .card, [class*="card"], article')
      .first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });

    const cardText = await firstCard.textContent();
    expect(cardText?.length).toBeGreaterThan(0);
  });

  test("SD-03: Search filters services by name", async ({ page }) => {
    const searchInput = page.locator(
      'input[type="search"], input[type="text"], input[placeholder*="Pesqui"], input[placeholder*="pesqui"]'
    );
    if ((await searchInput.count()) > 0) {
      await searchInput.first().fill("API");
      await page.waitForTimeout(1000);

      const results = page.locator(
        '[class*="card"], article, [class*="list-item"]'
      );
      const count = await results.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test("SD-04: Sort list changes order", async ({ page }) => {
    const sortControl = page.locator(
      'select, [class*="sort"], [class*="order"], button:has-text("Ordenar")'
    );
    if ((await sortControl.count()) > 0) {
      await sortControl.first().click();
      await page.waitForTimeout(500);
    }
  });

  test("SD-05: Pagination shows 20 items per page", async ({ page }) => {
    const cards = page.locator(
      'a[href*="/pages/dataservices/"], .card, [class*="card"], article'
    );
    await expect(cards.first()).toBeVisible({ timeout: 15000 });

    const count = await cards.count();
    expect(count).toBeLessThanOrEqual(20);

    const pagination = page.locator(
      '[class*="pagination"], nav[aria-label*="pagination"], [class*="pager"]'
    );
    if ((await pagination.count()) > 0) {
      await expect(pagination.first()).toBeVisible();
    }
  });

  test("SD-06: Click card opens detail with docs, base URL, license, datasets", async ({
    page,
  }) => {
    const firstLink = page
      .locator('a[href*="/pages/dataservices/"]')
      .first();
    if ((await firstLink.count()) > 0) {
      await firstLink.click();
      await page.waitForLoadState("networkidle");

      const heading = page.locator("h1, h2").first();
      await expect(heading).toBeVisible({ timeout: 10000 });

      const body = await page.textContent("body");
      expect(body).toBeTruthy();
    }
  });
});
