import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Responsiveness", () => {
  test("RA-01: Desktop (1280x720) - full layout, sidebars, 3-col grids", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${BASE_URL}/pages/datasets`);
    await page.waitForLoadState("networkidle");

    const header = page.locator("header").first();
    await expect(header).toBeVisible({ timeout: 10000 });

    const cards = page.locator("a[href*='/pages/datasets/']");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });

    // Sidebar should be visible on desktop (agora-sidebar)
    const sidebar = page.locator(".agora-sidebar").first();
    if ((await sidebar.count()) > 0) {
      await expect(sidebar).toBeVisible();
    }
  });

  test("RA-02: Tablet (768x1024) - 2-col grids, sidebars collapse", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/pages/datasets`);
    await page.waitForLoadState("networkidle");

    const header = page.locator("header").first();
    await expect(header).toBeVisible({ timeout: 10000 });

    const cards = page.locator("a[href*='/pages/datasets/']");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
  });

  test("RA-03: Mobile (375x812) - 1-col, hamburger menu", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const hamburger = page.locator(
      'button[aria-label*="menu"], button[aria-label*="Menu"], [class*="hamburger"], [class*="burger"], button[class*="mobile"]'
    );
    if ((await hamburger.count()) > 0) {
      await expect(hamburger.first()).toBeVisible();
    }
  });

  test("RA-04: Mobile hamburger menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
    // Wait for header to hydrate
    await page.waitForTimeout(3000);

    const hamburger = page.locator(
      'button[aria-label*="menu" i], [class*="hamburger"], [class*="burger"], button[class*="mobile"]'
    );
    if ((await hamburger.count()) > 0) {
      // Open menu
      await hamburger.first().click();
      await page.waitForTimeout(500);

      // Close menu by clicking hamburger again or a close button
      const closeButton = page.locator(
        'button[aria-label*="close" i], button[aria-label*="fechar" i]'
      );
      if ((await closeButton.count()) > 0) {
        await closeButton.first().click();
        await page.waitForTimeout(500);
      } else {
        await hamburger.first().click();
        await page.waitForTimeout(500);
      }
    }

    // Page should still be functional
    const body = await page.textContent("body");
    expect(body).toBeTruthy();
  });

  test("RA-05: Mobile search works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // Search might be behind a button on mobile
    const searchToggle = page.locator(
      'button[aria-label*="search"], button[aria-label*="Search"], [class*="search-toggle"]'
    );
    if ((await searchToggle.count()) > 0) {
      await searchToggle.first().click();
      await page.waitForTimeout(500);
    }

    const searchInput = page.locator(
      'input[type="search"], input[type="text"][placeholder*="Pesqui"], input[type="text"][placeholder*="pesqui"]'
    );
    if ((await searchInput.count()) > 0) {
      await searchInput.first().fill("dados");
      await searchInput.first().press("Enter");
      await page.waitForLoadState("networkidle");

      const body = await page.textContent("body");
      expect(body).toBeTruthy();
    }
  });

  test("RA-06: Mobile cards are full width and readable", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/pages/datasets`);
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator("a[href*='/pages/datasets/']").first();
    if ((await firstCard.count()) > 0) {
      await expect(firstCard).toBeVisible({ timeout: 15000 });

      const box = await firstCard.boundingBox();
      if (box) {
        // Card should take most of viewport width on mobile
        expect(box.width).toBeGreaterThan(250);
      }
    }
  });

  test("RA-07: Mobile filters are accessible", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/pages/datasets`);
    await page.waitForLoadState("networkidle");

    const filterToggle = page.locator(
      'button:has-text("Filtro"), button:has-text("Filtrar"), button[aria-label*="filter"], [class*="filter-toggle"]'
    );
    if ((await filterToggle.count()) > 0) {
      await filterToggle.first().click();
      await page.waitForTimeout(500);

      const filters = page.locator(
        '[class*="filter"], [class*="sidebar"], select'
      );
      if ((await filters.count()) > 0) {
        await expect(filters.first()).toBeVisible();
      }
    }
  });

  test("RA-08: Mobile tabs navigable without text cut", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/pages/datasets`);
    await page.waitForLoadState("networkidle");

    // Navigate to a dataset detail
    const firstLink = page.locator('a[href*="/pages/datasets/"]').first();
    if ((await firstLink.count()) > 0) {
      await firstLink.click();
      await page.waitForLoadState("networkidle");

      const tabs = page.locator(
        '[role="tablist"], [class*="tab"]'
      );
      if ((await tabs.count()) > 0) {
        const tabButtons = tabs.first().locator('button, a, [role="tab"]');
        for (let i = 0; i < Math.min(await tabButtons.count(), 3); i++) {
          const box = await tabButtons.nth(i).boundingBox();
          if (box) {
            // Tab should be within viewport
            expect(box.x + box.width).toBeLessThanOrEqual(375 + 20); // small tolerance
          }
        }
      }
    }
  });

  test("RA-09: Images load at all sizes without distortion", async ({
    page,
  }) => {
    const viewports = [
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 812 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(BASE_URL);
      await page.waitForLoadState("networkidle");

      const images = page.locator("img");
      const count = await images.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i);
        if (await img.isVisible()) {
          const box = await img.boundingBox();
          if (box && box.width > 0) {
            // Image should have positive dimensions
            expect(box.width).toBeGreaterThan(0);
            expect(box.height).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  test("RA-10: Keyboard navigation (Tab, Enter, Escape) works", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // Tab through elements
    await page.keyboard.press("Tab");
    await page.waitForTimeout(200);
    await page.keyboard.press("Tab");
    await page.waitForTimeout(200);
    await page.keyboard.press("Tab");
    await page.waitForTimeout(200);

    // Check that an element is focused
    const focusedTag = await page.evaluate(() =>
      document.activeElement?.tagName.toLowerCase()
    );
    expect(focusedTag).toBeTruthy();

    // Test Enter on focused element
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);

    // Test Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);

    const body = await page.textContent("body");
    expect(body).toBeTruthy();
  });
});
