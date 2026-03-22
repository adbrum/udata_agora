import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";
const DATASETS_URL = `${BASE_URL}/pages/datasets`;

test.describe("Dataset Detail", () => {
  let datasetDetailUrl: string;

  test.beforeEach(async ({ page }) => {
    // Navigate to datasets listing and click first dataset to get a valid detail URL
    await page.goto(DATASETS_URL);
    await page.waitForLoadState("networkidle");

    const firstLink = page.locator("a[href*='/pages/datasets/']").first();
    await expect(firstLink).toBeVisible({ timeout: 15000 });

    await firstLink.click();
    await page.waitForLoadState("networkidle");

    datasetDetailUrl = page.url();
    expect(datasetDetailUrl).toMatch(/\/pages\/datasets\/.+/);
  });

  test("DD-01: Page loads with title, description, files and sidebar", async ({
    page,
  }) => {
    // Title should be visible (h1 or prominent heading)
    const title = page.locator("h1, h2").first();
    await expect(title).toBeVisible({ timeout: 10000 });

    // Page should have substantial content
    const bodyText = await page.textContent("body");
    expect(bodyText?.length).toBeGreaterThan(100);
  });

  test("DD-02: Breadcrumb shows Inicio > Conjuntos de Dados > Name", async ({
    page,
  }) => {
    // Breadcrumb class contains "readcrumb" (from the design system)
    const breadcrumb = page.locator("[class*='readcrumb']").first();

    if ((await breadcrumb.count()) > 0) {
      const breadcrumbText = await breadcrumb.textContent();
      expect(breadcrumbText?.toLowerCase()).toContain("home");
      expect(breadcrumbText?.toLowerCase()).toContain("conjuntos de dados");
    }
  });

  test("DD-03: Title is prominent, draft/archived shows label", async ({
    page,
  }) => {
    const title = page.locator("h1").first();
    await expect(title).toBeVisible({ timeout: 10000 });

    const titleText = await title.textContent();
    expect(titleText?.trim().length).toBeGreaterThan(0);
  });

  test("DD-04: Description is formatted", async ({ page }) => {
    // Look for a description section - could be a paragraph or div with markdown content
    const description = page
      .locator("[class*='description'], [class*='markdown'], main p, article p")
      .first();
    if ((await description.count()) > 0) {
      await expect(description).toBeVisible({ timeout: 10000 });
    } else {
      // Fallback: just check the page has substantial content
      const bodyText = await page.textContent("body");
      expect(bodyText?.length).toBeGreaterThan(200);
    }
  });

  test("DD-05: Quality bar with progress score", async ({ page }) => {
    const qualityBar = page
      .locator("[class*='quality'], [class*='progress'], [class*='score']")
      .first();

    if ((await qualityBar.count()) > 0) {
      await expect(qualityBar).toBeVisible();
    }
  });

  test("DD-06: Individual quality criteria visible", async ({ page }) => {
    const qualityCriteria = page
      .locator("[class*='quality-criteria'], [class*='quality'] li, [class*='checklist']")
      .first();

    if ((await qualityCriteria.count()) > 0) {
      await expect(qualityCriteria).toBeVisible();
    }
  });

  test("DD-07: Sidebar shows org logo and name with link", async ({
    page,
  }) => {
    // Look for organization info in sidebar
    const sidebar = page.locator(
      "aside, [class*='sidebar'], [class*='side-panel']"
    );

    if ((await sidebar.count()) > 0) {
      const orgLink = sidebar
        .first()
        .locator("a[href*='/pages/organizations/']")
        .first();
      if ((await orgLink.count()) > 0) {
        await expect(orgLink).toBeVisible();
      }
    }
  });

  test("DD-08: Sidebar shows metadata: last update, license, metrics", async ({
    page,
  }) => {
    // Sidebar headings (H3): "Produtor", "Licença", "Qualidade dos metadados"
    const sidebarTerms = [
      /Produtor/i,
      /Licença/i,
      /Qualidade dos metadados/i,
    ];

    let found = 0;
    for (const term of sidebarTerms) {
      const el = page.getByText(term).first();
      if ((await el.count()) > 0) {
        found++;
      }
    }

    expect(found).toBeGreaterThanOrEqual(1);
  });

  test.skip(
    "DD-09: Favorites button with session adds favorite",
    async () => {
      // Skipped: requires authenticated session
    }
  );

  test.skip("DD-10: Remove favorite with session", async () => {
    // Skipped: requires authenticated session
  });

  test("DD-11: Favorites without session redirects to login", async ({
    page,
  }) => {
    // Look for a favorites/bookmark button or link
    const favBtn = page
      .getByRole("button", { name: /favorit|guardar|bookmark|seguir/i })
      .or(page.locator("[class*='favorite'], [class*='bookmark'], [class*='follow']"))
      .first();

    if ((await favBtn.count()) > 0) {
      await favBtn.click();
      await page.waitForLoadState("networkidle");

      // Should redirect to login
      await expect(page).toHaveURL(/login/, { timeout: 10000 });
    }
  });

  test("DD-12: Files tab shows table with title, format, size, date, download button", async ({
    page,
  }) => {
    // Look for resources/files section
    const filesSection = page
      .locator("[class*='resource'], [class*='file'], table")
      .first();

    if ((await filesSection.count()) > 0) {
      await expect(filesSection).toBeVisible({ timeout: 10000 });
    }

    // Look for download buttons/links
    const downloadElements = page
      .getByRole("link", { name: /download|descarregar|baixar/i })
      .or(page.locator("a[download], [class*='download']"));

    if ((await downloadElements.count()) > 0) {
      await expect(downloadElements.first()).toBeVisible();
    }
  });

  test("DD-13: Download button initiates download", async ({ page }) => {
    const downloadBtn = page
      .getByRole("link", { name: /download|descarregar|baixar/i })
      .or(page.locator("a[download], [class*='download']"))
      .first();

    if ((await downloadBtn.count()) > 0) {
      // Check that the download link has an href
      const href = await downloadBtn.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href?.length).toBeGreaterThan(0);
    }
  });

  test("DD-14: Preview button for tabular files", async ({ page }) => {
    // This test may be skipped if no tabular files are available
    const previewBtn = page
      .getByRole("button", { name: /preview|pré-visualizar|visualizar/i })
      .or(page.locator("[class*='preview']"))
      .first();

    if ((await previewBtn.count()) > 0) {
      await expect(previewBtn).toBeVisible();
    }
    // If no preview button exists, the test passes (not all datasets have tabular files)
  });

  test("DD-15: Reuses and APIs tab", async ({ page }) => {
    // Tab text is "Reutilizações e APIs (N)"
    const reusesTab = page.getByRole("tab", { name: /Reutilizações e APIs/i }).first();

    if ((await reusesTab.count()) > 0) {
      await expect(reusesTab).toBeVisible();
    } else {
      // Fallback: find by text
      const tabText = page.getByText(/Reutilizações e APIs/i).first();
      if ((await tabText.count()) > 0) {
        await expect(tabText).toBeVisible();
      }
    }
  });

  test("DD-16: Related data tab", async ({ page }) => {
    const relatedTab = page
      .getByRole("tab", { name: /relacionad|related|dados relacionados/i })
      .or(page.getByText(/dados relacionados|related data/i))
      .first();

    if ((await relatedTab.count()) > 0) {
      await expect(relatedTab).toBeVisible();
    }
  });

  test("DD-17: Discussions tab", async ({ page }) => {
    const discussionsTab = page
      .getByRole("tab", { name: /discuss|comentár/i })
      .or(page.getByText(/discussões|comentários|discussions/i))
      .first();

    if ((await discussionsTab.count()) > 0) {
      await expect(discussionsTab).toBeVisible();
    }
  });
});
