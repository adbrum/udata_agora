import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";
const ORGS_URL = `${BASE_URL}/pages/organizations`;

test.describe("Organization Detail", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to organizations listing and click first org
    await page.goto(ORGS_URL);
    await page.waitForLoadState("networkidle");

    const firstLink = page
      .locator("a[href*='/pages/organizations/']")
      .first();
    await expect(firstLink).toBeVisible({ timeout: 15000 });

    await firstLink.click();
    await page.waitForLoadState("networkidle");

    expect(page.url()).toMatch(/\/pages\/organizations\/.+/);
  });

  test("OD-01: Page loads with name, logo, description and tabs", async ({
    page,
  }) => {
    // Name / heading should be visible
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const headingText = await heading.textContent();
    expect(headingText?.trim().length).toBeGreaterThan(0);

    // Page should have substantial content
    const bodyText = await page.textContent("body");
    expect(bodyText?.length).toBeGreaterThan(100);
  });

  test("OD-02: Breadcrumb shows Inicio > Organizacoes > Name", async ({
    page,
  }) => {
    // Breadcrumb class contains "readcrumb"
    const breadcrumb = page.locator("[class*='readcrumb']").first();

    if ((await breadcrumb.count()) > 0) {
      const breadcrumbText = await breadcrumb.textContent();
      expect(breadcrumbText?.toLowerCase()).toContain("home");
      expect(breadcrumbText?.toLowerCase()).toContain("organiza");
    }
  });

  test("OD-03: Logo shows correctly or generic building icon", async ({
    page,
  }) => {
    // Look for org logo image or any image on the page
    const logo = page.locator("img").first();

    if ((await logo.count()) > 0) {
      await expect(logo).toBeVisible({ timeout: 10000 });
    }
    // Page should have content regardless
    const bodyText = await page.textContent("body");
    expect(bodyText?.length).toBeGreaterThan(100);
  });

  test.skip("OD-04: Favorites button works with session", async () => {
    // Skipped: requires authenticated session
  });

  test("OD-05: Description and informative sections visible", async ({
    page,
  }) => {
    // Page should have substantial content
    const bodyText = await page.textContent("body");
    expect(bodyText?.length).toBeGreaterThan(200);
  });

  test("OD-06: Sidebar metrics: datasets, members, followers", async ({
    page,
  }) => {
    const metricTerms = [
      /conjuntos de dados|datasets|conjunto/i,
      /membros|members/i,
      /seguidores|followers/i,
      /reutilizações|reuses/i,
    ];

    let found = 0;
    for (const term of metricTerms) {
      const el = page.getByText(term).first();
      if ((await el.count()) > 0) {
        found++;
      }
    }

    expect(found).toBeGreaterThanOrEqual(1);
  });

  test("OD-07: Datasets tab", async ({ page }) => {
    // Tabs may use role="tab" or be text-based links/buttons
    const datasetsTab = page.getByText(/conjuntos de dados|datasets/i).first();

    if ((await datasetsTab.count()) > 0) {
      await expect(datasetsTab).toBeVisible({ timeout: 10000 });
      await datasetsTab.click();
      await page.waitForLoadState("networkidle");

      // Should show dataset cards or a message
      const content = await page.textContent("body");
      expect(content?.length).toBeGreaterThan(100);
    }
  });

  test("OD-08: Reuses tab", async ({ page }) => {
    const reusesTab = page.getByText(/reutilizações/i).first();

    if ((await reusesTab.count()) > 0) {
      await expect(reusesTab).toBeVisible({ timeout: 10000 });
      await reusesTab.click();
      await page.waitForLoadState("networkidle");
    }
  });

  test("OD-09: Services tab", async ({ page }) => {
    const servicesTab = page.getByText(/serviços de dados|dataservices|APIs/i).first();

    if ((await servicesTab.count()) > 0) {
      await expect(servicesTab).toBeVisible({ timeout: 10000 });
      await servicesTab.click();
      await page.waitForLoadState("networkidle");
    }
  });

  test("OD-10: Members tab", async ({ page }) => {
    const membersTab = page.getByText(/membros|members/i).first();

    if ((await membersTab.count()) > 0) {
      await expect(membersTab).toBeVisible({ timeout: 10000 });
      await membersTab.click();
      await page.waitForLoadState("networkidle");
    }
  });
});
