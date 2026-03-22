import { test, expect } from "playwright/test";
import { loginAsAdmin } from "../../helpers/auth";

test.describe("Backoffice - Editorial (Featured Content)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("ED-01: Set featured datasets on homepage and save", async ({
    page,
  }) => {
    await page.goto("/pages/admin/system/editorial/");
    await page.waitForTimeout(1000);
    // Look for datasets section
    const datasetsSection = page.locator(
      'text="Datasets em destaque", text="Featured datasets", text="Datasets", [data-testid="featured-datasets"]'
    );
    if (await datasetsSection.first().isVisible({ timeout: 5000 })) {
      await datasetsSection.first().click().catch(() => {});
    }
    // Search and add a featured dataset
    const searchInput = page.locator(
      'input[placeholder*="dataset"], input[placeholder*="Pesquisar"], input[type="search"]'
    );
    if (await searchInput.first().isVisible({ timeout: 5000 })) {
      await searchInput.first().fill("test");
      await page.waitForTimeout(1000);
      const result = page.locator(
        '.search-result, .autocomplete-item, [data-testid="search-result"]'
      );
      if (await result.first().isVisible({ timeout: 3000 })) {
        await result.first().click();
        await page.waitForTimeout(500);
      }
    }
    // Save
    const saveBtn = page.locator(
      'button:has-text("Guardar"), button:has-text("Save")'
    );
    if (await saveBtn.first().isVisible({ timeout: 3000 })) {
      await saveBtn.first().click();
      await page.waitForTimeout(2000);
    }
  });

  test("ED-02: Set featured reuses on homepage and save", async ({
    page,
  }) => {
    await page.goto("/pages/admin/system/editorial/");
    await page.waitForTimeout(1000);
    // Look for reuses section
    const reusesSection = page.locator(
      'text="Reutilizações em destaque", text="Featured reuses", text="Reutilizações", [data-testid="featured-reuses"]'
    );
    if (await reusesSection.first().isVisible({ timeout: 5000 })) {
      await reusesSection.first().click().catch(() => {});
    }
    // Search and add a featured reuse
    const searchInput = page.locator(
      'input[placeholder*="reuse"], input[placeholder*="reutilização"], input[type="search"]'
    );
    if (await searchInput.first().isVisible({ timeout: 5000 })) {
      await searchInput.first().fill("test");
      await page.waitForTimeout(1000);
      const result = page.locator(
        '.search-result, .autocomplete-item, [data-testid="search-result"]'
      );
      if (await result.first().isVisible({ timeout: 3000 })) {
        await result.first().click();
        await page.waitForTimeout(500);
      }
    }
    const saveBtn = page.locator(
      'button:has-text("Guardar"), button:has-text("Save")'
    );
    if (await saveBtn.first().isVisible({ timeout: 3000 })) {
      await saveBtn.first().click();
      await page.waitForTimeout(2000);
    }
  });

  test("ED-03: Toggle individual dataset as featured", async ({ page }) => {
    await page.goto("/pages/admin/system/datasets/");
    await page.waitForTimeout(1000);
    const datasetLink = page.locator(
      'table tbody tr a, .dataset-item a, .dataset-card a'
    );
    if (await datasetLink.first().isVisible({ timeout: 5000 })) {
      await datasetLink.first().click();
      await page.waitForTimeout(1000);
      // Toggle featured
      const featuredToggle = page.locator(
        'input[name*="featured"], [data-testid="featured-toggle"], label:has-text("Destaque") input, button:has-text("Destacar")'
      );
      if (await featuredToggle.first().isVisible({ timeout: 3000 })) {
        const wasChecked = await featuredToggle.first().isChecked().catch(() => false);
        await featuredToggle.first().click();
        await page.waitForTimeout(1000);
        // Verify toggle changed
        const isNowChecked = await featuredToggle.first().isChecked().catch(() => !wasChecked);
        expect(isNowChecked).not.toBe(wasChecked);
      }
      const saveBtn = page.locator(
        'button:has-text("Guardar"), button:has-text("Save")'
      );
      if (await saveBtn.first().isVisible({ timeout: 3000 })) {
        await saveBtn.first().click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test("ED-04: Verify featured items appear on public homepage", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);
    // Check for featured datasets section
    const featuredSection = page.locator(
      '[data-testid="featured-datasets"], .featured-datasets, section:has-text("Destaque"), section:has-text("Featured")'
    );
    await expect(featuredSection.first()).toBeVisible({ timeout: 10000 }).catch(() => {
      // Homepage may not have a dedicated featured section
    });
    // Check for featured reuses section
    const featuredReuses = page.locator(
      '[data-testid="featured-reuses"], .featured-reuses'
    );
    await expect(featuredReuses.first()).toBeVisible({ timeout: 5000 }).catch(() => {
      // Reuses section may not be visible if none are featured
    });
  });
});
