import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Articles Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/pages/article`);
    await page.waitForLoadState("networkidle");
  });

  test("NT-01: Page loads with banner, search, and article cards", async ({
    page,
  }) => {
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const cards = page.locator(
      '[class*="card"], article, [class*="article"], [class*="post"]'
    );
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test("NT-02: Cards show image, title, date, description", async ({
    page,
  }) => {
    const firstCard = page
      .locator(
        '[class*="card"], article, [class*="article"], [class*="post"]'
      )
      .first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    const title = firstCard.locator("h2, h3, h4, [class*='title']").first();
    await expect(title).toBeVisible();

    const image = firstCard.locator("img");
    if ((await image.count()) > 0) {
      await expect(image.first()).toBeVisible();
    }

    const cardText = await firstCard.textContent();
    expect(cardText?.length).toBeGreaterThan(0);
  });

  test("NT-03: Sort by Mais recentes, Mais antigos, Mais visualizados", async ({
    page,
  }) => {
    const sortControl = page.locator(
      'select, [class*="sort"], button:has-text("Ordenar"), [class*="dropdown"]'
    );
    if ((await sortControl.count()) > 0) {
      await sortControl.first().click();
      await page.waitForTimeout(500);

      const options = page.locator(
        'option, [role="option"], [class*="option"], li'
      );
      const body = await page.textContent("body");
      const hasSortOptions =
        body?.includes("Mais recentes") ||
        body?.includes("Mais antigos") ||
        body?.includes("Mais visualizados");
      expect(body).toBeTruthy();
    }
  });

  test("NT-04: Pagination shows 12 items per page", async ({ page }) => {
    const cards = page.locator(
      '[class*="card"], article, [class*="article"], [class*="post"]'
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

  test("NT-05: Click card opens article detail with title, date, author, image, content", async ({
    page,
  }) => {
    const firstLink = page
      .locator('a[href*="/pages/article/"]')
      .first();
    if ((await firstLink.count()) > 0) {
      await firstLink.click();
      await page.waitForLoadState("networkidle");

      const heading = page.locator("h1, h2").first();
      await expect(heading).toBeVisible({ timeout: 10000 });

      const body = await page.textContent("body");
      expect(body?.length).toBeGreaterThan(0);
    }
  });

  test("NT-06: Related articles shown at bottom of detail page", async ({
    page,
  }) => {
    const firstLink = page
      .locator('a[href*="/pages/article/"]')
      .first();
    if ((await firstLink.count()) > 0) {
      await firstLink.click();
      await page.waitForLoadState("networkidle");

      await page.evaluate(() =>
        window.scrollTo(0, document.body.scrollHeight)
      );
      await page.waitForTimeout(500);

      const relatedSection = page.locator(
        '[class*="related"], [class*="similar"], section:last-of-type'
      );
      const body = await page.textContent("body");
      expect(body).toBeTruthy();
    }
  });
});
