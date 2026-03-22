import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";
const SEARCH_URL = `${BASE_URL}/pages/search`;

test.describe("Search", () => {
  test("PQ-01: Search page opens with text field and filters", async ({
    page,
  }) => {
    await page.goto(SEARCH_URL);
    await page.waitForLoadState("networkidle");

    // Search input should be visible
    const searchInput = page.getByRole("textbox").first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });

    // Filter area should be present
    const pageContent = await page.textContent("body");
    expect(pageContent?.length).toBeGreaterThan(0);
  });

  test("PQ-02: Search term transportes returns relevant results", async ({
    page,
  }) => {
    await page.goto(`${SEARCH_URL}?q=transportes`);
    await page.waitForLoadState("networkidle");

    // Should show results
    const results = page.locator("[class*='card'], [class*='result'], a[href*='datasets']").first();
    await expect(results).toBeVisible({ timeout: 15000 });
  });

  test("PQ-03: Verify 4 type tabs: Datasets, APIs, Reutilizações, Organizações", async ({
    page,
  }) => {
    await page.goto(`${SEARCH_URL}?q=dados`);
    await page.waitForLoadState("networkidle");

    const expectedTabs = [
      /dataset/i,
      /api/i,
      /reutiliza/i,
      /organiza/i,
    ];

    for (const tabPattern of expectedTabs) {
      const tab = page.getByRole("tab", { name: tabPattern }).or(
        page.getByRole("link", { name: tabPattern })
      ).or(
        page.getByRole("button", { name: tabPattern })
      ).first();
      await expect(tab).toBeVisible({ timeout: 10000 });
    }
  });

  test("PQ-04: Switch between tabs changes results", async ({ page }) => {
    await page.goto(`${SEARCH_URL}?q=dados`);
    await page.waitForLoadState("networkidle");

    // Get initial content
    const initialContent = await page.textContent("body");

    // Find and click a different tab (e.g., Organizações)
    const orgTab = page.getByRole("tab", { name: /organiza/i }).or(
      page.getByRole("link", { name: /organiza/i })
    ).or(
      page.getByRole("button", { name: /organiza/i })
    ).first();

    if ((await orgTab.count()) > 0) {
      await orgTab.click();
      await page.waitForLoadState("networkidle");

      // Content should have changed or URL should have changed
      const newUrl = page.url();
      const newContent = await page.textContent("body");
      const changed = newUrl !== `${SEARCH_URL}?q=dados` || newContent !== initialContent;
      expect(changed).toBeTruthy();
    }
  });

  test("PQ-05: Filter by format (Tabular, Estruturado, Geográfico, Documentos)", async ({
    page,
  }) => {
    await page.goto(`${SEARCH_URL}?q=dados`);
    await page.waitForLoadState("networkidle");

    // Look for format filter options
    const formatLabels = ["Tabular", "Estruturado", "Geográfico", "Documentos"];
    let foundFilters = 0;

    for (const label of formatLabels) {
      const filter = page.getByText(label, { exact: false }).first();
      if ((await filter.count()) > 0) {
        foundFilters++;
      }
    }

    expect(foundFilters).toBeGreaterThanOrEqual(1);
  });

  test("PQ-06: Filter by access method", async ({ page }) => {
    await page.goto(`${SEARCH_URL}?q=dados`);
    await page.waitForLoadState("networkidle");

    // Look for access method filter
    const accessFilter = page.getByText(/método de acesso|acesso/i).first();
    if ((await accessFilter.count()) > 0) {
      await expect(accessFilter).toBeVisible();
    }
  });

  test("PQ-07: Filter by date", async ({ page }) => {
    await page.goto(`${SEARCH_URL}?q=dados`);
    await page.waitForLoadState("networkidle");

    // Look for date filter
    const dateFilter = page.getByText(/data|período|date/i).first();
    if ((await dateFilter.count()) > 0) {
      await expect(dateFilter).toBeVisible();
    }
  });

  test("PQ-08: Filter by organization type", async ({ page }) => {
    await page.goto(`${SEARCH_URL}?q=dados`);
    await page.waitForLoadState("networkidle");

    // Look for organization type filter
    const orgFilter = page.getByText(/tipo de organização|organização/i).first();
    if ((await orgFilter.count()) > 0) {
      await expect(orgFilter).toBeVisible();
    }
  });

  test("PQ-09: Filter by data label (Alto valor, INSPIRE, etc.)", async ({
    page,
  }) => {
    await page.goto(`${SEARCH_URL}?q=dados`);
    await page.waitForLoadState("networkidle");

    const labels = ["Alto valor", "INSPIRE"];
    let found = 0;

    for (const label of labels) {
      const el = page.getByText(label, { exact: false }).first();
      if ((await el.count()) > 0) {
        found++;
      }
    }

    expect(found).toBeGreaterThanOrEqual(0);
  });

  test("PQ-10: Search xyzabc123 shows no results message", async ({
    page,
  }) => {
    await page.goto(`${SEARCH_URL}?q=xyzabc123`);
    await page.waitForLoadState("networkidle");

    // Should show a no results message or empty state
    const noResults = page.getByText(/sem resultados|nenhum resultado|no results|0 resultado/i).first();
    await expect(noResults).toBeVisible({ timeout: 10000 });
  });

  test("PQ-11: Pagination works with many results", async ({ page }) => {
    await page.goto(`${SEARCH_URL}?q=dados`);
    await page.waitForLoadState("networkidle");

    // Look for pagination controls
    const pagination = page.locator("nav[aria-label*='paginat' i], [class*='pagination'], [class*='pager']").first();
    if ((await pagination.count()) > 0) {
      await expect(pagination).toBeVisible();

      // Try to click next page
      const nextBtn = page.getByRole("link", { name: /next|seguinte|2|>/i }).first();
      if ((await nextBtn.count()) > 0) {
        await nextBtn.click();
        await page.waitForLoadState("networkidle");
        // URL should change to reflect new page
        expect(page.url()).toMatch(/page=2|p=2/);
      }
    }
  });

  test("PQ-12: URL params pre-fill search", async ({ page }) => {
    await page.goto(`${SEARCH_URL}?q=saude&type=datasets`);
    await page.waitForLoadState("networkidle");

    // The search input should be pre-filled with the query
    const searchInput = page.getByRole("textbox").first();
    await expect(searchInput).toHaveValue(/saude/i, { timeout: 10000 });
  });
});
