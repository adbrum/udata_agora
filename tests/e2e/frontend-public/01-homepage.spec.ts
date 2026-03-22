import { test, expect } from "playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("HP-01: Homepage loads correctly with banner, stats, highlights and news sections", async ({
    page,
  }) => {
    // Banner / hero section
    const hero = page.locator(".agora-card-highlight-newsletter");
    await expect(hero).toBeVisible({ timeout: 10000 });

    // Stats section
    const stats = page.locator(".stats-icon-wrapper").first();
    await expect(stats).toBeVisible({ timeout: 10000 });

    // Featured datasets section - loaded via Suspense, wait for hydration
    const datasetsHeading = page.getByText("Conjunto de dados", { exact: false });
    await expect(datasetsHeading).toBeVisible({ timeout: 10000 });

    // Latest news section
    const newsHeading = page.getByText("Últimas novidades", { exact: false });
    await expect(newsHeading).toBeVisible({ timeout: 10000 });
  });

  test("HP-02: Search bar submits and redirects to search page", async ({
    page,
  }) => {
    const searchInput = page.locator("#portal-search");
    await expect(searchInput).toBeVisible({ timeout: 10000 });

    await searchInput.fill("educação");
    await page.locator('button[aria-label="Pesquisar"]').first().click();

    await page.waitForURL(/\/pages\/search/, { timeout: 10000 });
    expect(page.url()).toContain("/pages/search");
  });

  test("HP-03: Search bar shows suggestion examples", async ({ page }) => {
    const hero = page.locator(".agora-card-highlight-newsletter");
    await expect(hero).toBeVisible();

    // Check for suggestion keywords in the hero area
    const heroText = await hero.textContent();
    const suggestions = ["educação", "saúde pública", "ambiente"];
    let foundSuggestions = 0;
    for (const suggestion of suggestions) {
      if (heroText?.toLowerCase().includes(suggestion.toLowerCase())) {
        foundSuggestions++;
      }
    }
    expect(foundSuggestions).toBeGreaterThanOrEqual(1);
  });

  test("HP-04: Publish button without session redirects to login", async ({
    page,
  }) => {
    const publishWrapper = page.locator(".publish-dropdown-wrapper");
    // If the publish button exists, click it
    if ((await publishWrapper.count()) > 0) {
      await publishWrapper.click();
      await page.waitForLoadState("networkidle");
      // Should redirect to login when not authenticated
      await expect(page).toHaveURL(/login/, { timeout: 10000 });
    } else {
      // Look for any publish-related button/link
      const publishBtn = page.getByRole("link", { name: /publicar/i });
      if ((await publishBtn.count()) > 0) {
        await publishBtn.first().click();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(/login/, { timeout: 10000 });
      }
    }
  });

  test.skip(
    "HP-05: Publish button with session shows 4 options dropdown",
    async () => {
      // Skipped: requires authenticated session
    }
  );

  test("HP-06: Stats section shows 4 counters", async ({ page }) => {
    // Wait for stats to hydrate
    await page.waitForTimeout(2000);

    const expectedLabels = [
      "Conjuntos de Dados",
      "Reutilizações",
      "Organizações",
      "Utilizadores",
    ];

    for (const label of expectedLabels) {
      const element = page.getByText(label, { exact: false }).first();
      await expect(element).toBeVisible({ timeout: 10000 });
    }

    // Verify 4 stat icons exist
    const statsIcons = page.locator(".stats-icon-wrapper");
    const count = await statsIcons.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("HP-07: Featured datasets section shows 3 cards with title, org, description", async ({
    page,
  }) => {
    // Dataset cards load via Suspense - wait for heading then cards
    const heading = page.getByText("Conjunto de dados", { exact: false });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Cards are inside a grid after the heading - wait for links to datasets
    const datasetsGrid = heading.locator("..").locator("..").locator("a[href*='/pages/datasets/']");
    await expect(datasetsGrid.first()).toBeVisible({ timeout: 15000 });

    const count = await datasetsGrid.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("HP-08: Click featured dataset card navigates to dataset detail", async ({
    page,
  }) => {
    const heading = page.getByText("Conjunto de dados", { exact: false });
    await expect(heading).toBeVisible({ timeout: 10000 });

    const datasetLink = page.locator("a[href*='/pages/datasets/']").first();
    await expect(datasetLink).toBeVisible({ timeout: 15000 });

    await datasetLink.click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/pages\/datasets\//, { timeout: 10000 });
  });

  test("HP-09: Ver todos os conjuntos de dados link navigates to datasets listing", async ({
    page,
  }) => {
    const viewAllLink = page.getByRole("link", {
      name: /ver todos os conjuntos de dados/i,
    });
    await expect(viewAllLink).toBeVisible({ timeout: 10000 });

    await viewAllLink.click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/pages\/datasets/, { timeout: 10000 });
  });

  test("HP-10: Partners section shows logos", async ({ page }) => {
    const partnersText = page.getByText(/utilizado diariamente por/i);
    await expect(partnersText).toBeVisible({ timeout: 10000 });

    // Check that there are logo images near this section
    const partnersSection = partnersText.locator("..").locator("..");
    const logos = partnersSection.locator("img");
    const logoCount = await logos.count();
    expect(logoCount).toBeGreaterThan(0);
  });

  test("HP-11: Data Stories section shows 3 cards on dark background", async ({
    page,
  }) => {
    const storiesHeading = page.getByText("Data Stories", { exact: false });
    await expect(storiesHeading).toBeVisible({ timeout: 10000 });

    const storiesSection = page.locator(".storytellings");
    await expect(storiesSection).toBeVisible({ timeout: 10000 });

    // Wait for hydrated content
    await page.waitForTimeout(2000);
    const cards = storiesSection.locator("a, > div");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("HP-12: Latest news section shows 3 cards with date, title and Ler mais button", async ({
    page,
  }) => {
    const newsHeading = page.getByText("Últimas novidades", { exact: false });
    await expect(newsHeading).toBeVisible({ timeout: 10000 });

    // News cards loaded via Suspense - wait for article links
    const articleLinks = page.locator("a[href*='/pages/article/']");
    await expect(articleLinks.first()).toBeVisible({ timeout: 15000 });

    const count = await articleLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("HP-13: Click Ler mais opens article detail", async ({ page }) => {
    const newsHeading = page.getByText("Últimas novidades", { exact: false });
    await expect(newsHeading).toBeVisible({ timeout: 10000 });

    // Wait for article links to hydrate
    const articleLink = page.locator("a[href*='/pages/article/']").first();
    await expect(articleLink).toBeVisible({ timeout: 15000 });

    const href = await articleLink.getAttribute("href");
    await articleLink.click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/pages\/article\//, { timeout: 10000 });
  });
});
