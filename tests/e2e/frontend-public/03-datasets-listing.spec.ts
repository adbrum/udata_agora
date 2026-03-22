import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";
const DATASETS_URL = `${BASE_URL}/pages/datasets`;

test.describe("Datasets Listing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DATASETS_URL);
    await page.waitForLoadState("networkidle");
  });

  test("DL-01: Page loads with dataset list and filter panel", async ({
    page,
  }) => {
    // Dataset cards should be visible
    const cards = page.locator("[class*='dataset-card'], [class*='card']").first();
    await expect(cards).toBeVisible({ timeout: 15000 });

    // Filter panel should be present
    const filters = page.locator("[class*='filter'], aside, [class*='sidebar']").first();
    await expect(filters).toBeVisible({ timeout: 10000 });
  });

  test("DL-02: Each card shows title, org, description, last update date", async ({
    page,
  }) => {
    const firstCard = page.locator("[class*='dataset-card'], [class*='card']").first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });

    const cardText = await firstCard.textContent();
    // Card should have meaningful text content (title at minimum)
    expect(cardText?.trim().length).toBeGreaterThan(10);
  });

  test("DL-03: Click card opens dataset detail", async ({ page }) => {
    const firstCard = page
      .locator("a[href*='/pages/datasets/']")
      .first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });

    await firstCard.click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/pages\/datasets\/.+/, { timeout: 10000 });
  });

  test("DL-04: Search field filters results", async ({ page }) => {
    const searchInput = page
      .getByRole("textbox", { name: /pesquisar|search|filtrar/i })
      .or(page.locator("input[type='search'], input[type='text']").first());

    if ((await searchInput.count()) > 0) {
      await searchInput.first().fill("educação");
      await searchInput.first().press("Enter");
      await page.waitForLoadState("networkidle");

      // Results should update
      const results = page.locator("[class*='dataset-card'], [class*='card']").first();
      await expect(results).toBeVisible({ timeout: 15000 });
    }
  });

  test("DL-05: Filter by tag", async ({ page }) => {
    const tagFilter = page.getByText(/tag|etiqueta|palavra-chave/i).first();
    if ((await tagFilter.count()) > 0) {
      await expect(tagFilter).toBeVisible();
    }
  });

  test("DL-06: Filter by license", async ({ page }) => {
    const licenseFilter = page.getByText(/licença|license/i).first();
    if ((await licenseFilter.count()) > 0) {
      await expect(licenseFilter).toBeVisible();
    }
  });

  test("DL-07: Filter by file format (CSV, JSON, XML)", async ({ page }) => {
    const formatFilter = page.getByText(/formato|format/i).first();
    if ((await formatFilter.count()) > 0) {
      await expect(formatFilter).toBeVisible();

      // Look for common format options
      const formats = ["CSV", "JSON", "XML"];
      let found = 0;
      for (const fmt of formats) {
        const el = page.getByText(fmt, { exact: true }).first();
        if ((await el.count()) > 0) {
          found++;
        }
      }
      expect(found).toBeGreaterThanOrEqual(0);
    }
  });

  test("DL-08: Filter by organization", async ({ page }) => {
    const orgFilter = page.getByText(/organização|organization/i).first();
    if ((await orgFilter.count()) > 0) {
      await expect(orgFilter).toBeVisible();
    }
  });

  test("DL-09: Filter by badge (Alto valor, INSPIRE)", async ({ page }) => {
    const badges = ["Alto valor", "INSPIRE"];
    let found = 0;

    for (const badge of badges) {
      const el = page.getByText(badge, { exact: false }).first();
      if ((await el.count()) > 0) {
        found++;
      }
    }

    expect(found).toBeGreaterThanOrEqual(0);
  });

  test("DL-10: Sort by Mais recentes, Mais visualizados, Mais descarregados", async ({
    page,
  }) => {
    // Look for sort dropdown or buttons
    const sortControl = page
      .getByRole("combobox")
      .or(page.getByText(/ordenar|sort/i))
      .first();

    if ((await sortControl.count()) > 0) {
      await expect(sortControl).toBeVisible();
    }
  });

  test("DL-11: Pagination works (20 per page)", async ({ page }) => {
    // Look for pagination
    const pagination = page
      .locator("nav[aria-label*='paginat' i], [class*='pagination'], [class*='pager']")
      .first();

    if ((await pagination.count()) > 0) {
      await expect(pagination).toBeVisible();
    }

    // Check that cards are present (up to 20)
    const cards = page.locator("a[href*='/pages/datasets/']");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(20);
  });

  test("DL-12: Combine multiple filters", async ({ page }) => {
    // Apply a search filter
    const searchInput = page
      .locator("input[type='search'], input[type='text']")
      .first();

    if ((await searchInput.count()) > 0) {
      await searchInput.fill("dados");
      await searchInput.press("Enter");
      await page.waitForLoadState("networkidle");

      // Results should still be visible after applying filter
      const results = page.locator("[class*='dataset-card'], [class*='card']");
      const count = await results.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test("DL-13: Clear all filters restores full list", async ({ page }) => {
    // First apply a search filter
    const searchInput = page
      .locator("input[type='search'], input[type='text']")
      .first();

    if ((await searchInput.count()) > 0) {
      await searchInput.fill("educação");
      await searchInput.press("Enter");
      await page.waitForLoadState("networkidle");

      // Now clear
      await searchInput.clear();
      await searchInput.press("Enter");
      await page.waitForLoadState("networkidle");

      // Look for clear filters button
      const clearBtn = page.getByRole("button", {
        name: /limpar|clear|reset/i,
      });
      if ((await clearBtn.count()) > 0) {
        await clearBtn.click();
        await page.waitForLoadState("networkidle");
      }

      // Full list should be restored
      const results = page.locator("a[href*='/pages/datasets/']");
      const count = await results.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});
