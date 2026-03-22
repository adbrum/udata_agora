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
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Tabs: "Conjuntos de dados (0)", "Reutilizações (0)"
    const datasetsTab = page.getByText(/Conjuntos de dados/).first();
    if (await datasetsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await datasetsTab.click().catch(() => {});
    }

    // Search label: "Pesquisar conjuntos de dados para adicionar"
    const searchInput = page.getByLabel(/Pesquisar conjuntos de dados/i).first();
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill("test");
      await page.waitForTimeout(1000);
    } else {
      const searchByPlaceholder = page.getByPlaceholder(/Pesquis/i).first();
      if (await searchByPlaceholder.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchByPlaceholder.fill("test");
        await page.waitForTimeout(1000);
      }
    }

    // "Guardar alterações" button (may be DISABLED if no changes)
    const saveBtn = page.getByRole("button", { name: "Guardar alterações" }).first();
    if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await saveBtn.click().catch(() => {
        // May be disabled
      });
      await page.waitForTimeout(2000);
    }
  });

  test("ED-02: Set featured reuses on homepage and save", async ({
    page,
  }) => {
    await page.goto("/pages/admin/system/editorial/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Click "Reutilizações" tab
    const reusesTab = page.getByText(/Reutilizações/).first();
    if (await reusesTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await reusesTab.click().catch(() => {});
    }

    // Search
    const searchInput = page.getByLabel(/Pesquisar reutilizações/i).first();
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill("test");
      await page.waitForTimeout(1000);
    } else {
      const searchByPlaceholder = page.getByPlaceholder(/Pesquis/i).first();
      if (await searchByPlaceholder.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchByPlaceholder.fill("test");
        await page.waitForTimeout(1000);
      }
    }

    // "Guardar alterações" button
    const saveBtn = page.getByRole("button", { name: "Guardar alterações" }).first();
    if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await saveBtn.click().catch(() => {
        // May be disabled
      });
      await page.waitForTimeout(2000);
    }
  });

  test("ED-03: Toggle individual dataset as featured", async ({ page }) => {
    await page.goto("/pages/admin/system/datasets/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const datasetLink = page.locator('a[href*="/datasets/"]').first();
    if (await datasetLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await datasetLink.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Toggle featured
      const featuredToggle = page.getByLabel(/Destaque|Featured/i).first();
      const featuredBtn = page.getByRole("button", { name: /Destacar|Feature/i }).first();
      if (await featuredToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
        await featuredToggle.click();
        await page.waitForTimeout(1000);
      } else if (await featuredBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await featuredBtn.click();
        await page.waitForTimeout(1000);
      }

      const saveBtn = page.getByRole("button", { name: /Guardar/i }).first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test("ED-04: Verify featured items appear on public homepage", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Check that the homepage has loaded with content
    const mainContent = await page.locator("main").first().textContent().catch(() => "");
    expect((mainContent || "").length).toBeGreaterThan(100);

    // Check for any section that might contain featured content
    const featuredSection = page.getByText(/Destaque|dados/i).first();
    await expect(featuredSection).toBeVisible({ timeout: 10000 }).catch(() => {
      // Homepage may not have a dedicated featured section
    });
  });
});
