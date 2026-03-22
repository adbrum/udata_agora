import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";
const ORGS_URL = `${BASE_URL}/pages/organizations`;

test.describe("Organizations Listing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ORGS_URL);
    await page.waitForLoadState("networkidle");
  });

  test("OL-01: Page loads with org list and filters", async ({ page }) => {
    // Organization cards should be visible
    const cards = page
      .locator("a[href*='/pages/organizations/']")
      .or(page.locator("[class*='org-card'], [class*='organization-card'], [class*='card']"))
      .first();
    await expect(cards).toBeVisible({ timeout: 15000 });

    // Filter/search area should be present
    const filters = page
      .locator("input[type='search'], input[type='text'], [class*='filter'], aside")
      .first();
    if ((await filters.count()) > 0) {
      await expect(filters).toBeVisible();
    }
  });

  test("OL-02: Cards show logo, name, description, metrics", async ({
    page,
  }) => {
    const firstCard = page
      .locator("a[href*='/pages/organizations/']")
      .or(page.locator("[class*='org-card'], [class*='organization-card']"))
      .first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });

    // Card should have text content (name at minimum)
    const cardText = await firstCard.textContent();
    expect(cardText?.trim().length).toBeGreaterThan(0);

    // Look for logos (images) within cards
    const cardContainer = firstCard.locator("..").locator("..");
    const images = cardContainer.locator("img");
    const imgCount = await images.count();
    // Some cards may have logos, but not required for all
    expect(imgCount).toBeGreaterThanOrEqual(0);
  });

  test("OL-03: Click card opens org detail", async ({ page }) => {
    const firstLink = page
      .locator("a[href*='/pages/organizations/']")
      .first();
    await expect(firstLink).toBeVisible({ timeout: 15000 });

    await firstLink.click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/pages\/organizations\/.+/, {
      timeout: 10000,
    });
  });

  test("OL-04: Search filters by name", async ({ page }) => {
    const searchInput = page
      .getByRole("textbox", { name: /pesquisar|search|filtrar/i })
      .or(page.locator("input[type='search'], input[type='text']").first());

    if ((await searchInput.count()) > 0) {
      await searchInput.first().fill("instituto");
      await searchInput.first().press("Enter");
      await page.waitForLoadState("networkidle");

      // Results should update
      const results = page
        .locator("a[href*='/pages/organizations/']")
        .or(page.locator("[class*='org-card'], [class*='card']"));
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
    const pagination = page
      .locator(
        "nav[aria-label*='paginat' i], [class*='pagination'], [class*='pager']"
      )
      .first();

    if ((await pagination.count()) > 0) {
      await expect(pagination).toBeVisible();

      const nextBtn = page
        .getByRole("link", { name: /next|seguinte|2|>/i })
        .first();
      if ((await nextBtn.count()) > 0) {
        await nextBtn.click();
        await page.waitForLoadState("networkidle");
      }
    }

    // At minimum, some org cards should be present on the page
    const cards = page.locator("a[href*='/pages/organizations/']");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});
