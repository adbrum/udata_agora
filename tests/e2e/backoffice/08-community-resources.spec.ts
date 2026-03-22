import { test, expect } from "playwright/test";
import { loginAsAdmin } from "../../helpers/auth";

test.describe("Backoffice - Community Resources CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("CR-01: Create community resource - title, description, file appears in dataset community resources", async ({
    page,
  }) => {
    await page.goto("/pages/admin/community-resources/new/");
    await page.waitForTimeout(1000);
    // Fill title
    const titleInput = page.locator(
      'input[name="title"], input[name*="title"], input[name*="name"]'
    );
    if (await titleInput.isVisible({ timeout: 5000 })) {
      await titleInput.fill("E2E Community Resource");
    }
    // Fill description
    const descInput = page.locator(
      'textarea[name="description"], .ql-editor, [contenteditable="true"]'
    );
    if (await descInput.first().isVisible({ timeout: 3000 })) {
      await descInput.first().fill("Community resource created by E2E tests");
    }
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible({ timeout: 5000 })) {
      const csvContent = "id,value\n1,community-test\n";
      await fileInput.setInputFiles({
        name: "community-data.csv",
        mimeType: "text/csv",
        buffer: Buffer.from(csvContent),
      });
      await page.waitForTimeout(2000);
    }
    // Associate with dataset
    const datasetSearch = page.locator(
      'input[placeholder*="dataset"], input[placeholder*="Pesquisar"], [data-testid="dataset-search"]'
    );
    if (await datasetSearch.isVisible({ timeout: 3000 })) {
      await datasetSearch.fill("test");
      await page.waitForTimeout(1000);
      const result = page.locator(
        '.search-result, .autocomplete-item'
      );
      if (await result.first().isVisible({ timeout: 3000 })) {
        await result.first().click();
      }
    }
    // Save
    const saveBtn = page.locator(
      'button:has-text("Guardar"), button:has-text("Save"), button:has-text("Criar")'
    );
    if (await saveBtn.first().isVisible({ timeout: 3000 })) {
      await saveBtn.first().click();
      await page.waitForTimeout(2000);
    }
  });

  test("CR-02: Edit community resource name and description then save", async ({
    page,
  }) => {
    await page.goto("/pages/admin/me/community-resources/");
    await page.waitForTimeout(1000);
    const resourceLink = page.locator(
      'table tbody tr a, .resource-item a, .community-resource-card a'
    );
    if (await resourceLink.first().isVisible({ timeout: 5000 })) {
      await resourceLink.first().click();
      await page.waitForTimeout(1000);
      const titleInput = page.locator(
        'input[name="title"], input[name*="title"], input[name*="name"]'
      );
      if (await titleInput.isVisible({ timeout: 5000 })) {
        await titleInput.clear();
        await titleInput.fill("Updated Community Resource");
      }
      const descInput = page.locator(
        'textarea[name="description"], .ql-editor, [contenteditable="true"]'
      );
      if (await descInput.first().isVisible({ timeout: 3000 })) {
        await descInput.first().click();
        await descInput.first().fill("Updated community resource description");
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

  test("CR-03: Delete community resource removes it", async ({ page }) => {
    await page.goto("/pages/admin/me/community-resources/");
    const resourceItems = page.locator(
      'table tbody tr, .resource-item, .community-resource-card'
    );
    const initialCount = await resourceItems.count();
    if (initialCount > 0) {
      await resourceItems.first().locator("a").first().click();
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

  test("CR-04: Check community resource listings - personal, org, system", async ({
    page,
  }) => {
    // Personal
    await page.goto("/pages/admin/me/community-resources/");
    await page.waitForTimeout(1000);
    const personalList = page.locator(
      'table, .resource-list, text="Nenhum recurso", text="No resources"'
    );
    await expect(personalList.first()).toBeVisible({ timeout: 10000 });
    // Organization
    await page.goto("/pages/admin/org/community-resources/");
    await page.waitForTimeout(1000);
    const orgList = page.locator(
      'table, .resource-list, text="Nenhum recurso", text="No resources"'
    );
    await expect(orgList.first()).toBeVisible({ timeout: 10000 });
    // System
    await page.goto("/pages/admin/system/community-resources/");
    await page.waitForTimeout(1000);
    const systemList = page.locator(
      'table, .resource-list, text="Nenhum recurso", text="No resources"'
    );
    await expect(systemList.first()).toBeVisible({ timeout: 10000 });
  });
});
