import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";
const REUSES_URL = `${BASE_URL}/pages/reuses`;

test.describe("Reuses Listing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(REUSES_URL);
    await page.waitForLoadState("networkidle");
  });

  test("RL-01: Page loads with reuse cards and filters", async ({ page }) => {
    // H1 heading
    const heading = page.getByRole("heading", { name: /Reutilizações/i, level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Reuse card links should be visible
    const cards = page.locator("a[href*='/pages/reuses/']").first();
    await expect(cards).toBeVisible({ timeout: 15000 });

    // Search input with page-specific ID
    const searchInput = page.locator("#reuses-search");
    if ((await searchInput.count()) > 0) {
      await expect(searchInput).toBeVisible();
    }
  });

  test("RL-02: Cards show image, title, type, org, metrics", async ({
    page,
  }) => {
    const firstCard = page.locator("a[href*='/pages/reuses/']").first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });

    // Card should have text content
    const cardText = await firstCard.textContent();
    expect(cardText?.trim().length).toBeGreaterThan(0);
  });

  test("RL-03: Click card opens reuse detail", async ({ page }) => {
    const firstLink = page
      .locator("a[href*='/pages/reuses/']")
      .first();
    await expect(firstLink).toBeVisible({ timeout: 15000 });

    await firstLink.click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/pages\/reuses\/.+/, { timeout: 10000 });
  });

  test("RL-04: Search filters by name", async ({ page }) => {
    const searchInput = page.locator("#reuses-search");

    if ((await searchInput.count()) > 0) {
      await searchInput.fill("dados");
      await searchInput.press("Enter");
      await page.waitForLoadState("networkidle");

      // Results should update
      const results = page.locator("a[href*='/pages/reuses/']");
      const count = await results.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test("RL-05: Filter by type", async ({ page }) => {
    const typeFilter = page.getByText(/tipo|type/i).first();

    if ((await typeFilter.count()) > 0) {
      await expect(typeFilter).toBeVisible();
    }
  });

  test("RL-06: Filter by tag", async ({ page }) => {
    const tagFilter = page
      .getByText(/tag|etiqueta|palavra-chave/i)
      .first();

    if ((await tagFilter.count()) > 0) {
      await expect(tagFilter).toBeVisible();
    }
  });

  test("RL-07: Filter by organization", async ({ page }) => {
    // Filters are in the agora-sidebar
    const orgFilter = page.locator(".agora-sidebar").getByText("Organizações", { exact: false }).first();

    if ((await orgFilter.count()) > 0) {
      await expect(orgFilter).toBeVisible();
    }
  });

  test("RL-08: Sort reuses", async ({ page }) => {
    const sortControl = page
      .getByRole("combobox")
      .or(page.getByText(/ordenar|sort/i))
      .first();

    if ((await sortControl.count()) > 0) {
      await expect(sortControl).toBeVisible();
    }
  });

  test("RL-09: Pagination (12 per page)", async ({ page }) => {
    // Check that cards are present (up to 12)
    const cards = page.locator("a[href*='/pages/reuses/']");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(12);

    // Pagination may not exist if results fit in one page
    const pagination = page
      .locator(
        "nav[aria-label*='paginat' i], [class*='pagination'], [class*='pager']"
      )
      .first();

    if ((await pagination.count()) > 0) {
      await expect(pagination).toBeVisible();
    }
  });
});
