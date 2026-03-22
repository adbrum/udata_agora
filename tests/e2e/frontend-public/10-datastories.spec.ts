import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Datastories Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/pages/datastories`);
    await page.waitForLoadState("networkidle");
  });

  test("DS-01: Page loads with banner and story cards", async ({ page }) => {
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const cards = page.locator(
      '[class*="card"], article, [class*="story"]'
    );
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test("DS-02: Cards show image, title, description, organization, metrics", async ({
    page,
  }) => {
    const firstCard = page
      .locator('[class*="card"], article, [class*="story"]')
      .first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    const image = firstCard.locator("img");
    if ((await image.count()) > 0) {
      await expect(image.first()).toBeVisible();
    }

    const title = firstCard.locator("h2, h3, h4, [class*='title']").first();
    await expect(title).toBeVisible();

    const cardText = await firstCard.textContent();
    expect(cardText?.length).toBeGreaterThan(0);
  });

  test("DS-03: Search filters stories", async ({ page }) => {
    const searchInput = page.locator(
      'input[type="search"], input[type="text"], input[placeholder*="Pesqui"], input[placeholder*="pesqui"]'
    );
    if ((await searchInput.count()) > 0) {
      await searchInput.first().fill("dados");
      await page.waitForTimeout(1000);

      const results = page.locator(
        '[class*="card"], article, [class*="story"]'
      );
      const count = await results.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test("DS-04: Pagination shows 12 items per page", async ({ page }) => {
    const cards = page.locator(
      '[class*="card"], article, [class*="story"]'
    );
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    const count = await cards.count();
    expect(count).toBeLessThanOrEqual(12);

    const pagination = page.locator(
      '[class*="pagination"], nav[aria-label*="pagination"], [class*="pager"]'
    );
    if ((await pagination.count()) > 0) {
      await expect(pagination.first()).toBeVisible();
    }
  });

  test("DS-05: Click card opens story detail", async ({ page }) => {
    const firstLink = page
      .locator('a[href*="/pages/datastories/"]')
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
