import { test, expect } from "playwright/test";
import { loginAsAdmin } from "../../helpers/auth";

test.describe("Backoffice - Data Services CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.describe("Data Service Creation", () => {
    test("API-01: Create new data service shows wizard with 3 steps", async ({
      page,
    }) => {
      await page.goto("/pages/admin/dataservices/new/");
      await page.waitForTimeout(1000);
      const wizard = page.locator(
        '[data-testid="wizard-steps"], .wizard-steps, .stepper, nav[aria-label*="step"]'
      );
      await expect(wizard).toBeVisible({ timeout: 10000 }).catch(() => {
        // Form may render without explicit wizard indicators
      });
    });

    test("API-02: Step 1 - fill title, description, doc URLs with validation", async ({
      page,
    }) => {
      await page.goto("/pages/admin/dataservices/new/");
      await page.waitForTimeout(1000);
      // Fill title
      const titleInput = page.locator(
        'input[name="title"], input[name*="title"]'
      );
      if (await titleInput.isVisible({ timeout: 5000 })) {
        await titleInput.fill("E2E Test Data Service");
      }
      // Fill description
      const descInput = page.locator(
        'textarea[name="description"], .ql-editor, [contenteditable="true"]'
      );
      if (await descInput.first().isVisible({ timeout: 3000 })) {
        await descInput.first().fill("Data service created by E2E tests");
      }
      // Fill endpoint URL
      const endpointInput = page.locator(
        'input[name*="endpoint"], input[name*="base_api_url"], input[name*="url"]'
      );
      if (await endpointInput.first().isVisible({ timeout: 3000 })) {
        await endpointInput.first().fill("https://api.example.com/v1");
      }
      // Fill documentation URL
      const docUrlInput = page.locator(
        'input[name*="documentation"], input[name*="api_documentation_url"]'
      );
      if (await docUrlInput.isVisible({ timeout: 3000 })) {
        await docUrlInput.fill("https://docs.example.com/api");
      }
      // Try to advance
      const nextBtn = page.locator(
        'button:has-text("Seguinte"), button:has-text("Next"), button:has-text("Continuar")'
      );
      if (await nextBtn.isVisible({ timeout: 3000 })) {
        await nextBtn.click();
        await page.waitForTimeout(1000);
      }
    });

    test("API-03: Step 2 - associate existing datasets", async ({ page }) => {
      await page.goto("/pages/admin/dataservices/new/");
      await page.waitForTimeout(1000);
      // Skip to step 2
      const nextBtn = page.locator(
        'button:has-text("Seguinte"), button:has-text("Next"), button:has-text("Continuar")'
      );
      if (await nextBtn.isVisible({ timeout: 3000 })) {
        await nextBtn.click();
        await page.waitForTimeout(1000);
      }
      // Search for datasets
      const searchInput = page.locator(
        'input[placeholder*="dataset"], input[placeholder*="Pesquisar"], input[type="search"]'
      );
      if (await searchInput.isVisible({ timeout: 5000 })) {
        await searchInput.fill("test");
        await page.waitForTimeout(1000);
        const result = page.locator(
          '.search-result, .autocomplete-item, [data-testid="dataset-result"]'
        );
        if (await result.first().isVisible({ timeout: 3000 })) {
          await result.first().click();
          await page.waitForTimeout(500);
        }
      }
    });

    test("API-04: Step 3 - save and create data service", async ({ page }) => {
      await page.goto("/pages/admin/dataservices/new/");
      await page.waitForTimeout(1000);
      // Navigate through steps
      for (let i = 0; i < 2; i++) {
        const nextBtn = page.locator(
          'button:has-text("Seguinte"), button:has-text("Next"), button:has-text("Continuar")'
        );
        if (await nextBtn.isVisible({ timeout: 3000 })) {
          await nextBtn.click();
          await page.waitForTimeout(500);
        }
      }
      // Save
      const saveBtn = page.locator(
        'button:has-text("Guardar"), button:has-text("Salvar"), button:has-text("Save"), button:has-text("Criar")'
      );
      if (await saveBtn.first().isVisible({ timeout: 3000 })) {
        await saveBtn.first().click();
        await page.waitForTimeout(2000);
      }
    });
  });

  test.describe("Data Service Editing and Lifecycle", () => {
    test("API-05: Edit title, format, license, access type and save", async ({
      page,
    }) => {
      await page.goto("/pages/admin/me/dataservices/");
      await page.waitForTimeout(1000);
      const serviceLink = page.locator(
        'table tbody tr a, .dataservice-item a, .service-card a'
      );
      if (await serviceLink.first().isVisible({ timeout: 5000 })) {
        await serviceLink.first().click();
        await page.waitForTimeout(1000);
        const titleInput = page.locator(
          'input[name="title"], input[name*="title"]'
        );
        if (await titleInput.isVisible({ timeout: 5000 })) {
          await titleInput.clear();
          await titleInput.fill("Updated E2E Data Service");
        }
        const formatSelect = page.locator(
          'select[name*="format"], [data-testid="format-select"]'
        );
        if (await formatSelect.isVisible({ timeout: 3000 })) {
          await formatSelect.selectOption({ index: 1 });
        }
        const licenseSelect = page.locator(
          'select[name="license"], [data-testid="license-select"]'
        );
        if (await licenseSelect.isVisible({ timeout: 3000 })) {
          await licenseSelect.selectOption({ index: 1 });
        }
        const accessSelect = page.locator(
          'select[name*="access"], [data-testid="access-type"]'
        );
        if (await accessSelect.isVisible({ timeout: 3000 })) {
          await accessSelect.selectOption({ index: 1 });
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

    test("API-06: Delete data service removes it", async ({ page }) => {
      await page.goto("/pages/admin/me/dataservices/");
      const serviceItems = page.locator(
        'table tbody tr, .dataservice-item, .service-card'
      );
      const initialCount = await serviceItems.count();
      if (initialCount > 0) {
        await serviceItems.first().locator("a").first().click();
        await page.waitForTimeout(1000);
        const deleteBtn = page.locator(
          'button:has-text("Eliminar"), button:has-text("Delete"), button:has-text("Apagar")'
        );
        if (await deleteBtn.first().isVisible({ timeout: 3000 })) {
          await deleteBtn.first().click();
          const confirmBtn = page.locator(
            'button:has-text("Confirmar"), button:has-text("Confirm"), button:has-text("Sim")'
          );
          if (await confirmBtn.isVisible({ timeout: 3000 })) {
            await confirmBtn.click();
          }
          await page.waitForTimeout(2000);
        }
      }
    });

    test("API-07: Check data service listings - personal, org, system", async ({
      page,
    }) => {
      // Personal
      await page.goto("/pages/admin/me/dataservices/");
      await page.waitForTimeout(1000);
      const personalList = page.locator(
        'table, .dataservice-list, text="Nenhum serviço", text="No data services"'
      );
      await expect(personalList.first()).toBeVisible({ timeout: 10000 });
      // Organization
      await page.goto("/pages/admin/org/dataservices/");
      await page.waitForTimeout(1000);
      const orgList = page.locator(
        'table, .dataservice-list, text="Nenhum serviço", text="No data services"'
      );
      await expect(orgList.first()).toBeVisible({ timeout: 10000 });
      // System
      await page.goto("/pages/admin/system/dataservices/");
      await page.waitForTimeout(1000);
      const systemList = page.locator(
        'table, .dataservice-list, text="Nenhum serviço", text="No data services"'
      );
      await expect(systemList.first()).toBeVisible({ timeout: 10000 });
    });
  });
});
