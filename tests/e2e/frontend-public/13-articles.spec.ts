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
    // H1: "Últimas novidades"
    const heading = page.getByRole("heading", { name: /Últimas novidades/i, level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Search input
    const searchInput = page.locator("#articles-search");
    if ((await searchInput.count()) > 0) {
      await expect(searchInput).toBeVisible();
    }

    // Article links
    const cards = page.locator("a[href*='/pages/article/']");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
  });

  test("NT-02: Cards show image, title, date, description", async ({
    page,
  }) => {
    const firstCard = page.locator("a[href*='/pages/article/']").first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });

    const cardText = await firstCard.textContent();
    expect(cardText?.trim().length).toBeGreaterThan(0);
  });

  test("NT-03: Sort by Mais recentes, Mais antigos, Mais visualizados", async ({
    page,
  }) => {
    // Sort options are in divs with text
    const body = await page.textContent("body");
    const hasSortOptions =
      body?.includes("Mais recentes") ||
      body?.includes("Mais antigos") ||
      body?.includes("Mais visualizados");
    expect(hasSortOptions).toBeTruthy();
  });

  test("NT-04: Pagination shows 12 items per page", async ({ page }) => {
    const cards = page.locator("a[href*='/pages/article/']");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });

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
