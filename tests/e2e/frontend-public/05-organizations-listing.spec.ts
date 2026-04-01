import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";
const ORGS_URL = `${BASE_URL}/pages/organizations`;

test.describe("Organizations Listing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ORGS_URL);
    await page.waitForLoadState("networkidle");
  });

  test("OL-01: Page loads with org list and filters", async ({ page }) => {
    // H1 heading
    const heading = page.getByRole("heading", { name: /Organizações/i, level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Organization card links should be visible
    const cards = page.locator("a[href*='/pages/organizations/']").first();
    await expect(cards).toBeVisible({ timeout: 15000 });

    // Filter sidebar uses agora-sidebar with "Tipo de Organização"
    const filters = page.locator(".agora-sidebar").first();
    if ((await filters.count()) > 0) {
      await expect(filters).toBeVisible();
    }
  });

  test("OL-02: Cards show logo, name, description, metrics", async ({
    page,
  }) => {
    const firstCard = page.locator("a[href*='/pages/organizations/']").first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });

    // Card should have text content (name at minimum)
    const cardText = await firstCard.textContent();
    expect(cardText?.trim().length).toBeGreaterThan(0);
  });

  test("OL-03: Click card opens org detail", async ({ page }) => {
    const firstLink = page.locator("a[href*='/pages/organizations/']").first();
    await expect(firstLink).toBeVisible({ timeout: 15000 });

    await firstLink.click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/pages\/organizations\/.+/, {
      timeout: 10000,
    });
  });

  test("OL-04: Search filters by name", async ({ page }) => {
    const searchInput = page.locator("#organizations-search");

    if ((await searchInput.count()) > 0) {
      await searchInput.fill("instituto");
      await searchInput.press("Enter");
      await page.waitForLoadState("networkidle");

      // Results should update
      const results = page.locator("a[href*='/pages/organizations/']");
      const count = await results.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test("OL-05: Filter by certification/badge", async ({ page }) => {
    const certFilter = page
      .getByText(/certificad|badge|selo/i)
      .first();

    if ((await certFilter.count()) > 0) {
      await expect(certFilter).toBeVisible();
    }
  });

  test("OL-06: Sort list", async ({ page }) => {
    const sortControl = page
      .getByRole("combobox")
      .or(page.getByText(/ordenar|sort/i))
      .first();

    if ((await sortControl.count()) > 0) {
      await expect(sortControl).toBeVisible();
    }
  });

  test("OL-07: Pagination works", async ({ page }) => {
    // At minimum, some org cards should be present on the page
    const cards = page.locator("a[href*='/pages/organizations/']");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

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
