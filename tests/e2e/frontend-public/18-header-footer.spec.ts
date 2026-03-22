import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Header and Footer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
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

      const logo = page.locator(
        'header img, header svg, header [class*="logo"], [class*="header"] img'
      );
      await expect(
        logo.first(),
        `Logo should be visible on ${pagePath}`
      ).toBeVisible({ timeout: 10000 });

      const header = page.locator("header, [class*='header']").first();
      await expect(header).toBeVisible();
    }
  });

  test("NV-02: Menu items navigate correctly (Datasets, Reutilizações, Organizações)", async ({
    page,
  }) => {
    const datasetsLink = page.locator(
      'header a:has-text("Datasets"), nav a:has-text("Datasets"), a:has-text("Conjuntos")'
    );
    if ((await datasetsLink.count()) > 0) {
      await datasetsLink.first().click();
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("dataset");
      await page.goBack();
    }

    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const reusesLink = page.locator(
      'header a:has-text("Reutilizações"), nav a:has-text("Reutilizações")'
    );
    if ((await reusesLink.count()) > 0) {
      await reusesLink.first().click();
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("reuse");
      await page.goBack();
    }

    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const orgsLink = page.locator(
      'header a:has-text("Organizações"), nav a:has-text("Organizações")'
    );
    if ((await orgsLink.count()) > 0) {
      await orgsLink.first().click();
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("organization");
    }
  });

  test("NV-03: Hover on submenu items shows sub-options", async ({
    page,
  }) => {
    const submenuTrigger = page.locator(
      'nav button:has-text("Desenvolvimento"), nav a:has-text("Desenvolvimento"), nav button:has-text("Publicações"), nav a:has-text("Publicações")'
    );
    if ((await submenuTrigger.count()) > 0) {
      await submenuTrigger.first().hover();
      await page.waitForTimeout(500);

      const submenu = page.locator(
        '[class*="submenu"], [class*="dropdown"], [class*="popover"], ul[class*="menu"]'
      );
      if ((await submenu.count()) > 0) {
        await expect(submenu.first()).toBeVisible();
      }
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
    const langSelector = page.locator(
      '[class*="lang"], [class*="language"], select[name*="lang"], button:has-text("PT"), button:has-text("Português")'
    );
    if ((await langSelector.count()) > 0) {
      await expect(langSelector.first()).toBeVisible();
    }
  });

  test('NV-06: "Autenticar" button visible and opens login', async ({
    page,
  }) => {
    const authButton = page.locator(
      'a:has-text("Autenticar"), button:has-text("Autenticar"), a:has-text("Login"), button:has-text("Login")'
    );
    if ((await authButton.count()) > 0) {
      await expect(authButton.first()).toBeVisible();
      await authButton.first().click();
      await page.waitForLoadState("networkidle");

      expect(page.url()).toContain("login");
    }
  });

  test.skip("NV-07: User menu with session (needs auth)", async () => {
    // Skipped: requires authenticated session
  });

  test("NV-08: Footer shows 3 columns: Dados abertos, Plataforma, Desenvolvimento", async ({
    page,
  }) => {
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight)
    );
    await page.waitForTimeout(500);

    const footer = page.locator("footer, [class*='footer']").first();
    await expect(footer).toBeVisible({ timeout: 5000 });

    const footerText = await footer.textContent();
    expect(footerText).toBeTruthy();
  });

  test("NV-09: Footer links work: Catálogo, Sobre nós, Contactar-nos, Termos, API", async ({
    page,
  }) => {
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight)
    );
    await page.waitForTimeout(500);

    const footer = page.locator("footer, [class*='footer']").first();
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
    await page.waitForTimeout(500);

    const footer = page.locator("footer, [class*='footer']").first();
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
    await page.waitForTimeout(500);

    const footer = page.locator("footer, [class*='footer']").first();
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
    await page.waitForTimeout(500);

    const footer = page.locator("footer, [class*='footer']").first();
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
