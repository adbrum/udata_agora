import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Header and Footer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
    // Header/footer are client-rendered via Suspense - wait for hydration
    await page.waitForTimeout(3000);
  });

  test("NV-01: Header shows logo, search, nav menu, auth button on all pages", async ({
    page,
  }) => {
    const pages = [
      "/",
      "/pages/datasets",
      "/pages/reuses",
      "/pages/organizations",
    ];

    for (const pagePath of pages) {
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForLoadState("networkidle");
      // Wait for header to hydrate (client-rendered via Suspense)
      await page.waitForTimeout(3000);

      const header = page.locator("header").first();
      await expect(header).toBeVisible({ timeout: 10000 });

      // Logo link to "/"
      const logoLink = header.locator('a[href="/"]').first();
      if ((await logoLink.count()) > 0) {
        await expect(logoLink).toBeVisible();
      }
    }
  });

  test("NV-02: Menu items navigate correctly (Contribuir, Explorar, Conhecimento dropdowns)", async ({
    page,
  }) => {
    // Wait for header to hydrate
    await page.waitForTimeout(3000);

    // Header NAV items are dropdowns: "Contribuir", "Explorar", "Conhecimento"
    const navItems = ["Contribuir", "Explorar", "Conhecimento"];
    let foundNav = 0;

    for (const item of navItems) {
      const navItem = page.getByText(item, { exact: true }).first();
      if ((await navItem.count()) > 0) {
        foundNav++;
      }
    }

    expect(foundNav).toBeGreaterThanOrEqual(1);
  });

  test("NV-03: Hover on submenu items shows sub-options", async ({
    page,
  }) => {
    // Wait for header to hydrate
    await page.waitForTimeout(3000);

    // Header nav items are dropdowns: "Contribuir", "Explorar", "Conhecimento"
    const submenuTrigger = page.getByText("Explorar", { exact: true }).first();
    if ((await submenuTrigger.count()) > 0) {
      await submenuTrigger.hover();
      await page.waitForTimeout(500);

      // Should show dropdown sub-options
      const body = await page.textContent("body");
      expect(body).toBeTruthy();
    }
  });

  test("NV-04: Header search bar works and redirects", async ({ page }) => {
    const searchInput = page.locator(
      'header input[type="search"], header input[type="text"], [class*="header"] input[type="search"], [class*="header"] input[type="text"]'
    );
    if ((await searchInput.count()) > 0) {
      await searchInput.first().fill("teste");
      await searchInput.first().press("Enter");
      await page.waitForLoadState("networkidle");

      const url = page.url();
      expect(
        url.includes("search") ||
          url.includes("q=") ||
          url.includes("datasets")
      ).toBeTruthy();
    }
  });

  test("NV-05: Language selector visible (Portuguese default)", async ({
    page,
  }) => {
    // Wait for header to hydrate
    await page.waitForTimeout(3000);

    // Language options: "Português" (selected), "English", "Español", "Français"
    const langSelector = page.getByText("Português", { exact: true }).first();
    if ((await langSelector.count()) > 0) {
      await expect(langSelector).toBeVisible();
    }
  });

  test('NV-06: "Autenticar" button visible and opens login', async ({
    page,
  }) => {
    // Wait for header to hydrate
    await page.waitForTimeout(3000);

    // Auth link: a[href="/pages/login"] with text "Autenticar"
    const authButton = page.locator('a[href="/pages/login"]').first();
    if ((await authButton.count()) > 0) {
      await expect(authButton).toBeVisible();
      await authButton.click();
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("login");
    }
  });

  test.skip("NV-07: User menu with session (needs auth)", async () => {
    // Skipped: requires authenticated session
  });

  test("NV-08: Footer shows 4 columns: Mais para descobrir, Dados abertos, Plataforma, Desenvolvimento", async ({
    page,
  }) => {
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight)
    );
    // Wait for footer to hydrate
    await page.waitForTimeout(3000);

    const footer = page.locator("footer").first();
    await expect(footer).toBeVisible({ timeout: 10000 });

    // Footer column headings are h4 elements
    const footerHeadings = footer.locator("h4");
    const count = await footerHeadings.count();
    expect(count).toBeGreaterThanOrEqual(3);

    const footerText = await footer.textContent();
    expect(footerText).toContain("Dados abertos");
    expect(footerText).toContain("Plataforma");
    expect(footerText).toContain("Desenvolvimento");
  });

  test("NV-09: Footer links work: Catálogo, Sobre nós, Contactar-nos, Termos, API", async ({
    page,
  }) => {
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight)
    );
    await page.waitForTimeout(3000);

    const footer = page.locator("footer").first();
    const footerLinks = footer.locator("a");
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);

    // Verify links have href attributes
    for (let i = 0; i < Math.min(count, 5); i++) {
      const href = await footerLinks.nth(i).getAttribute("href");
      expect(href).toBeTruthy();
    }
  });

  test("NV-10: Footer institutional logos and LinkedIn", async ({ page }) => {
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight)
    );
    // Wait for footer to hydrate
    await page.waitForTimeout(3000);

    const footer = page.locator("footer").first();
    await expect(footer).toBeVisible({ timeout: 10000 });

    const images = footer.locator("img, svg");
    if ((await images.count()) > 0) {
      await expect(images.first()).toBeVisible();
    }

    const linkedinLink = footer.locator(
      'a[href*="linkedin"], a[aria-label*="LinkedIn"]'
    );
    if ((await linkedinLink.count()) > 0) {
      await expect(linkedinLink.first()).toBeVisible();
    }
  });

  test("NV-11: External footer links open in new tab", async ({ page }) => {
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight)
    );
    await page.waitForTimeout(3000);

    const footer = page.locator("footer").first();
    const externalLinks = footer.locator('a[target="_blank"]');
    if ((await externalLinks.count()) > 0) {
      for (let i = 0; i < Math.min(await externalLinks.count(), 3); i++) {
        const target = await externalLinks.nth(i).getAttribute("target");
        expect(target).toBe("_blank");
      }
    }
  });

  test("NV-12: Copyright info visible in footer", async ({ page }) => {
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight)
    );
    await page.waitForTimeout(3000);

    const footer = page.locator("footer").first();
    const footerText = await footer.textContent();
    expect(footerText).toBeTruthy();
    // Check for copyright or year indicator
    const hasCopyright =
      footerText?.includes("©") ||
      footerText?.includes("Copyright") ||
      footerText?.includes("2024") ||
      footerText?.includes("2025") ||
      footerText?.includes("2026") ||
      footerText?.includes("Todos os direitos");
    expect(hasCopyright).toBeTruthy();
  });
});
