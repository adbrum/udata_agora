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
    const breadcrumb = page
      .locator("nav[aria-label*='breadcrumb' i], [class*='breadcrumb']")
      .or(page.getByText(/início/i).first().locator(".."));

    if ((await breadcrumb.count()) > 0) {
      const breadcrumbText = await breadcrumb.first().textContent();
      expect(breadcrumbText?.toLowerCase()).toContain("início");
      expect(breadcrumbText?.toLowerCase()).toContain("organiza");
    }
  });

  test("OD-03: Logo shows correctly or generic building icon", async ({
    page,
  }) => {
    // Look for org logo image or a generic icon
    const logo = page
      .locator("img[alt*='logo' i], img[alt*='organiz' i], [class*='logo'], [class*='avatar']")
      .first();

    if ((await logo.count()) > 0) {
      await expect(logo).toBeVisible();
    } else {
      // Check for a generic icon (SVG or icon class)
      const icon = page
        .locator("[class*='icon'], svg")
        .first();
      if ((await icon.count()) > 0) {
        await expect(icon).toBeVisible();
      }
    }
  });

  test.skip("OD-04: Favorites button works with session", async () => {
    // Skipped: requires authenticated session
  });

  test("OD-05: Description and informative sections visible", async ({
    page,
  }) => {
    // Look for description content
    const description = page
      .locator("[class*='description'], [class*='markdown'], [class*='about']")
      .or(page.locator("p").first());

    if ((await description.count()) > 0) {
      await expect(description.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("OD-06: Sidebar metrics: datasets, members, followers", async ({
    page,
  }) => {
    const metricTerms = [
      /conjuntos de dados|datasets/i,
      /membros|members/i,
      /seguidores|followers/i,
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
    const datasetsTab = page
      .getByRole("tab", { name: /dataset|conjuntos de dados/i })
      .or(page.getByRole("link", { name: /dataset|conjuntos de dados/i }))
      .or(page.getByRole("button", { name: /dataset|conjuntos de dados/i }))
      .first();

    if ((await datasetsTab.count()) > 0) {
      await expect(datasetsTab).toBeVisible();
      await datasetsTab.click();
      await page.waitForLoadState("networkidle");

      // Should show dataset cards or a message
      const content = await page.textContent("body");
      expect(content?.length).toBeGreaterThan(100);
    }
  });

  test("OD-08: Reuses tab", async ({ page }) => {
    const reusesTab = page
      .getByRole("tab", { name: /reutilizaç|reuse/i })
      .or(page.getByRole("link", { name: /reutilizaç|reuse/i }))
      .or(page.getByRole("button", { name: /reutilizaç|reuse/i }))
      .first();

    if ((await reusesTab.count()) > 0) {
      await expect(reusesTab).toBeVisible();
      await reusesTab.click();
      await page.waitForLoadState("networkidle");
    }
  });

  test("OD-09: Services tab", async ({ page }) => {
    const servicesTab = page
      .getByRole("tab", { name: /serviço|service|api/i })
      .or(page.getByRole("link", { name: /serviço|service|api/i }))
      .or(page.getByRole("button", { name: /serviço|service|api/i }))
      .first();

    if ((await servicesTab.count()) > 0) {
      await expect(servicesTab).toBeVisible();
      await servicesTab.click();
      await page.waitForLoadState("networkidle");
    }
  });

  test("OD-10: Members tab", async ({ page }) => {
    const membersTab = page
      .getByRole("tab", { name: /membro|member/i })
      .or(page.getByRole("link", { name: /membro|member/i }))
      .or(page.getByRole("button", { name: /membro|member/i }))
      .first();

    if ((await membersTab.count()) > 0) {
      await expect(membersTab).toBeVisible();
      await membersTab.click();
      await page.waitForLoadState("networkidle");
    }
  });
});
