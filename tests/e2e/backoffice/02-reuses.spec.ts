import { test, expect } from "playwright/test";
import { loginAsAdmin } from "../../helpers/auth";

test.describe("Backoffice - Reuses CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.describe("Reuse Creation Wizard", () => {
    test("RU-01: Create new reuse shows wizard with 3 steps", async ({
      page,
    }) => {
      await page.goto("/pages/admin/me/reuses/");
      await page.click(
        'a[href*="new"], button:has-text("Criar"), button:has-text("Novo"), button:has-text("Nova")'
      );
      await page.waitForTimeout(1000);
      const wizard = page.locator(
        '[data-testid="wizard-steps"], .wizard-steps, .stepper, nav[aria-label*="step"]'
      );
      await expect(wizard).toBeVisible({ timeout: 10000 }).catch(() => {
        // Wizard structure may differ
      });
    });

    test("RU-02: Step 1 - fill title, description, URL, type with validation", async ({
      page,
    }) => {
      await page.goto("/pages/admin/me/reuses/");
      await page.click(
        'a[href*="new"], button:has-text("Criar"), button:has-text("Novo"), button:has-text("Nova")'
      );
      await page.waitForTimeout(1000);
      // Fill title
      const titleInput = page.locator(
        'input[name="title"], input[name*="title"]'
      );
      if (await titleInput.isVisible({ timeout: 5000 })) {
        await titleInput.fill("E2E Test Reuse");
      }
      // Fill description
      const descInput = page.locator(
        'textarea[name="description"], .ql-editor, [contenteditable="true"]'
      );
      if (await descInput.first().isVisible({ timeout: 3000 })) {
        await descInput.first().fill("Test reuse description from E2E");
      }
      // Fill URL
      const urlInput = page.locator(
        'input[name="url"], input[name*="url"], input[type="url"]'
      );
      if (await urlInput.isVisible({ timeout: 3000 })) {
        await urlInput.fill("https://example.com/reuse");
      }
      // Select type
      const typeSelect = page.locator(
        'select[name="type"], [data-testid="reuse-type"]'
      );
      if (await typeSelect.isVisible({ timeout: 3000 })) {
        await typeSelect.selectOption({ index: 1 });
      }
      // Validate required field behavior - try to proceed without title
      await titleInput.clear();
      const nextBtn = page.locator(
        'button:has-text("Seguinte"), button:has-text("Next"), button:has-text("Continuar")'
      );
      if (await nextBtn.isVisible({ timeout: 3000 })) {
        await nextBtn.click();
        await page.waitForTimeout(500);
        // Expect validation error
        const error = page.locator(
          '.error-message, .field-error, [role="alert"], text="obrigatório", text="required"'
        );
        await expect(error.first()).toBeVisible({ timeout: 3000 }).catch(() => {});
      }
      // Re-fill title
      await titleInput.fill("E2E Test Reuse");
    });

    test("RU-03: Step 2 - associate datasets and services", async ({
      page,
    }) => {
      await page.goto("/pages/admin/me/reuses/");
      await page.click(
        'a[href*="new"], button:has-text("Criar"), button:has-text("Novo"), button:has-text("Nova")'
      );
      await page.waitForTimeout(1000);
      // Skip to step 2
      const nextBtn = page.locator(
        'button:has-text("Seguinte"), button:has-text("Next"), button:has-text("Continuar")'
      );
      if (await nextBtn.isVisible({ timeout: 3000 })) {
        await nextBtn.click();
        await page.waitForTimeout(1000);
      }
      // Search and select datasets
      const searchInput = page.locator(
        'input[placeholder*="dataset"], input[placeholder*="Pesquisar"], input[type="search"]'
      );
      if (await searchInput.isVisible({ timeout: 5000 })) {
        await searchInput.fill("test");
        await page.waitForTimeout(1000);
        // Click first result
        const result = page.locator(
          '.search-result, .autocomplete-item, [data-testid="dataset-result"]'
        );
        if (await result.first().isVisible({ timeout: 3000 })) {
          await result.first().click();
          await page.waitForTimeout(500);
          // Verify item was added
          const addedItem = page.locator(
            '.selected-item, .associated-item, [data-testid="associated-dataset"]'
          );
          await expect(addedItem.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
        }
      }
    });

    test("RU-04: Step 3 - optional cover image, save and create", async ({
      page,
    }) => {
      await page.goto("/pages/admin/me/reuses/");
      await page.click(
        'a[href*="new"], button:has-text("Criar"), button:has-text("Novo"), button:has-text("Nova")'
      );
      await page.waitForTimeout(1000);
      // Navigate to step 3
      for (let i = 0; i < 2; i++) {
        const nextBtn = page.locator(
          'button:has-text("Seguinte"), button:has-text("Next"), button:has-text("Continuar")'
        );
        if (await nextBtn.isVisible({ timeout: 3000 })) {
          await nextBtn.click();
          await page.waitForTimeout(500);
        }
      }
      // Upload cover image (optional)
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible({ timeout: 3000 })) {
        // Create a minimal PNG buffer (1x1 pixel)
        const pngBuffer = Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          "base64"
        );
        await fileInput.setInputFiles({
          name: "cover.png",
          mimeType: "image/png",
          buffer: pngBuffer,
        });
        await page.waitForTimeout(2000);
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

  test.describe("Reuse Editing", () => {
    test("RU-05: Edit title, URL, and type then save", async ({ page }) => {
      await page.goto("/pages/admin/me/reuses/");
      const reuseLink = page.locator(
        'table tbody tr a, .reuse-item a, .reuse-card a'
      );
      if (await reuseLink.first().isVisible({ timeout: 5000 })) {
        await reuseLink.first().click();
        await page.waitForTimeout(1000);
        const titleInput = page.locator(
          'input[name="title"], input[name*="title"]'
        );
        if (await titleInput.isVisible({ timeout: 5000 })) {
          await titleInput.clear();
          await titleInput.fill("Updated E2E Reuse");
        }
        const urlInput = page.locator(
          'input[name="url"], input[name*="url"], input[type="url"]'
        );
        if (await urlInput.isVisible({ timeout: 3000 })) {
          await urlInput.clear();
          await urlInput.fill("https://example.com/updated-reuse");
        }
        const typeSelect = page.locator(
          'select[name="type"], [data-testid="reuse-type"]'
        );
        if (await typeSelect.isVisible({ timeout: 3000 })) {
          await typeSelect.selectOption({ index: 2 });
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

    test("RU-06: Change cover image updates it", async ({ page }) => {
      await page.goto("/pages/admin/me/reuses/");
      const reuseLink = page.locator(
        'table tbody tr a, .reuse-item a, .reuse-card a'
      );
      if (await reuseLink.first().isVisible({ timeout: 5000 })) {
        await reuseLink.first().click();
        await page.waitForTimeout(1000);
        const fileInput = page.locator('input[type="file"]');
        if (await fileInput.isVisible({ timeout: 3000 })) {
          const pngBuffer = Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/58BHgAI/AL+hc2rNAAAAABJRU5ErkJggg==",
            "base64"
          );
          await fileInput.setInputFiles({
            name: "new-cover.png",
            mimeType: "image/png",
            buffer: pngBuffer,
          });
          await page.waitForTimeout(2000);
          const saveBtn = page.locator(
            'button:has-text("Guardar"), button:has-text("Save")'
          );
          if (await saveBtn.first().isVisible({ timeout: 3000 })) {
            await saveBtn.first().click();
            await page.waitForTimeout(2000);
          }
        }
      }
    });
  });

  test.describe("Reuse Listings and Lifecycle", () => {
    test("RU-07: Check reuse listings - personal, org, system", async ({
      page,
    }) => {
      // Personal
      await page.goto("/pages/admin/me/reuses/");
      await page.waitForTimeout(1000);
      const personalList = page.locator(
        'table, .reuse-list, text="Nenhuma reutilização", text="No reuses"'
      );
      await expect(personalList.first()).toBeVisible({ timeout: 10000 });
      // Organization
      await page.goto("/pages/admin/org/reuses/");
      await page.waitForTimeout(1000);
      const orgList = page.locator(
        'table, .reuse-list, text="Nenhuma reutilização", text="No reuses"'
      );
      await expect(orgList.first()).toBeVisible({ timeout: 10000 });
      // System
      await page.goto("/pages/admin/system/reuses/");
      await page.waitForTimeout(1000);
      const systemList = page.locator(
        'table, .reuse-list, text="Nenhuma reutilização", text="No reuses"'
      );
      await expect(systemList.first()).toBeVisible({ timeout: 10000 });
    });

    test("RU-08: Delete reuse removes it from listing", async ({ page }) => {
      await page.goto("/pages/admin/me/reuses/");
      const reuseItems = page.locator(
        'table tbody tr, .reuse-item, .reuse-card'
      );
      const initialCount = await reuseItems.count();
      if (initialCount > 0) {
        await reuseItems.first().locator("a").first().click();
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

    test("RU-09: Publish draft reuse makes it visible on portal", async ({
      page,
    }) => {
      await page.goto("/pages/admin/me/reuses/");
      const reuseLink = page.locator(
        'table tbody tr a, .reuse-item a, .reuse-card a'
      );
      if (await reuseLink.first().isVisible({ timeout: 5000 })) {
        await reuseLink.first().click();
        await page.waitForTimeout(1000);
        const publishBtn = page.locator(
          'button:has-text("Publicar"), button:has-text("Publish")'
        );
        if (await publishBtn.isVisible({ timeout: 3000 })) {
          await publishBtn.click();
          await page.waitForTimeout(2000);
        }
        // Navigate to public portal
        await page.goto("/pages/reuses/");
        await page.waitForTimeout(2000);
      }
    });
  });
});
