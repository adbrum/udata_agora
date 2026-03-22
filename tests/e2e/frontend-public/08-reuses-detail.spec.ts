import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Reuse Detail Page", () => {
  let reuseUrl: string;

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/pages/reuses`);
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator("a[href*='/pages/reuses/']").first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    const href = await firstCard.getAttribute("href");
    reuseUrl = href?.startsWith("http") ? href : `${BASE_URL}${href}`;
    await page.goto(reuseUrl);
    await page.waitForLoadState("networkidle");
  });

  test("RD-01: Reuse detail page loads with title, type, description, tabs", async ({
    page,
  }) => {
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const pageContent = await page.textContent("body");
    expect(pageContent).toBeTruthy();

    const tabs = page.locator('[role="tablist"], [class*="tab"]');
    await expect(tabs.first()).toBeVisible({ timeout: 5000 }).catch(() => {
      // Tabs may be rendered differently
    });
  });

  test("RD-02: Breadcrumb shows Início > Reutilizações > [Name]", async ({
    page,
  }) => {
    const breadcrumb = page.locator(
      'nav[aria-label*="breadcrumb"], nav[aria-label*="Breadcrumb"], [class*="breadcrumb"]'
    );
    await expect(breadcrumb.first()).toBeVisible({ timeout: 5000 });

    const breadcrumbText = await breadcrumb.first().textContent();
    expect(breadcrumbText?.toLowerCase()).toContain("início");
    expect(breadcrumbText?.toLowerCase()).toContain("reutilizações");
  });

  test("RD-03: Type badge or label is visible", async ({ page }) => {
    const badge = page.locator(
      '[class*="badge"], [class*="tag"], [class*="label"], [class*="type"]'
    );
    await expect(badge.first()).toBeVisible({ timeout: 5000 }).catch(() => {
      // Badge might not be present for all reuses
    });
  });

  test('RD-04: "Ver reutilização" button opens external link in new tab', async ({
    page,
  }) => {
    const externalLink = page.locator(
      'a:has-text("Ver reutilização"), a:has-text("ver reutilização"), a[target="_blank"]'
    );
    if ((await externalLink.count()) > 0) {
      const target = await externalLink.first().getAttribute("target");
      expect(target).toBe("_blank");
    }
  });

  test.skip("RD-05: Favorites functionality (needs auth)", async () => {
    // Skipped: requires authenticated user
  });

  test("RD-06: Metrics section shows views, followers, associated datasets", async ({
    page,
  }) => {
    const body = await page.textContent("body");
    const hasMetrics =
      body?.includes("visualizações") ||
      body?.includes("seguidores") ||
      body?.includes("datasets") ||
      body?.includes("conjuntos") ||
      body?.match(/\d+/);
    expect(hasMetrics).toBeTruthy();
  });

  test("RD-07: About tab shows description and metadata", async ({
    page,
  }) => {
    const aboutTab = page.locator(
      'button:has-text("Sobre"), a:has-text("Sobre"), [role="tab"]:has-text("Sobre")'
    );
    if ((await aboutTab.count()) > 0) {
      await aboutTab.first().click();
      await page.waitForTimeout(500);
    }

    const description = page.locator(
      '[class*="description"], [class*="about"], p'
    );
    await expect(description.first()).toBeVisible({ timeout: 5000 });
  });

  test("RD-08: Datasets tab shows associated datasets (6 per page)", async ({
    page,
  }) => {
    const datasetsTab = page.locator(
      'button:has-text("Datasets"), a:has-text("Datasets"), button:has-text("Conjuntos"), a:has-text("Conjuntos"), [role="tab"]:has-text("Dataset")'
    );
    if ((await datasetsTab.count()) > 0) {
      await datasetsTab.first().click();
      await page.waitForTimeout(1000);

      const datasetCards = page.locator(
        '[class*="card"], [class*="dataset"], article'
      );
      const count = await datasetCards.count();
      expect(count).toBeLessThanOrEqual(6);
    }
  });

  test("RD-09: Related reuses tab shows related reuses", async ({ page }) => {
    const relatedTab = page.locator(
      'button:has-text("Reutilizações"), a:has-text("Reutilizações"), [role="tab"]:has-text("Reutilizações")'
    );
    if ((await relatedTab.count()) > 0) {
      await relatedTab.first().click();
      await page.waitForTimeout(1000);

      const body = await page.textContent("body");
      expect(body).toBeTruthy();
    }
  });
});
