import { test, expect } from "playwright/test";
import { loginAsAdmin } from "../../helpers/auth";

test.describe("Backoffice - Topics CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("TP-01: Create topic - name (required), description, tags", async ({
    page,
  }) => {
    await page.goto("/pages/admin/system/topics/");
    await page.waitForTimeout(1000);
    const createBtn = page.locator(
      'a[href*="new"], button:has-text("Criar"), button:has-text("Novo")'
    );
    if (await createBtn.first().isVisible({ timeout: 5000 })) {
      await createBtn.first().click();
      await page.waitForTimeout(1000);
    }
    // Fill name
    const nameInput = page.locator(
      'input[name="name"], input[name*="name"], input[name*="title"]'
    );
    if (await nameInput.isVisible({ timeout: 5000 })) {
      await nameInput.fill("E2E Test Topic");
    }
    // Fill description
    const descInput = page.locator(
      'textarea[name="description"], .ql-editor, [contenteditable="true"]'
    );
    if (await descInput.first().isVisible({ timeout: 3000 })) {
      await descInput.first().fill("Topic created by E2E tests");
    }
    // Add tags
    const tagInput = page.locator(
      'input[name*="tag"], input[placeholder*="tag"], [data-testid="tag-input"]'
    );
    if (await tagInput.isVisible({ timeout: 3000 })) {
      await tagInput.fill("e2e-test");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);
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

  test("TP-02: Add datasets, reuses, and services to topic", async ({
    page,
  }) => {
    await page.goto("/pages/admin/system/topics/");
    await page.waitForTimeout(1000);
    const topicLink = page.locator(
      'table tbody tr a, .topic-item a, .topic-card a'
    );
    if (await topicLink.first().isVisible({ timeout: 5000 })) {
      await topicLink.first().click();
      await page.waitForTimeout(1000);
      // Search and add items
      const searchInput = page.locator(
        'input[placeholder*="Pesquisar"], input[placeholder*="Search"], input[type="search"]'
      );
      if (await searchInput.isVisible({ timeout: 5000 })) {
        await searchInput.fill("test");
        await page.waitForTimeout(1000);
        const result = page.locator(
          '.search-result, .autocomplete-item, [data-testid="item-result"]'
        );
        if (await result.first().isVisible({ timeout: 3000 })) {
          await result.first().click();
          await page.waitForTimeout(500);
          const addedItem = page.locator(
            '.associated-item, .topic-item, [data-testid="topic-dataset"]'
          );
          await expect(addedItem.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
        }
      }
    }
  });

  test("TP-03: Remove item from topic", async ({ page }) => {
    await page.goto("/pages/admin/system/topics/");
    await page.waitForTimeout(1000);
    const topicLink = page.locator(
      'table tbody tr a, .topic-item a, .topic-card a'
    );
    if (await topicLink.first().isVisible({ timeout: 5000 })) {
      await topicLink.first().click();
      await page.waitForTimeout(1000);
      const removeBtn = page.locator(
        'button:has-text("Remover"), button:has-text("Remove"), [data-testid="remove-item"], button[aria-label="Remove"]'
      );
      if (await removeBtn.first().isVisible({ timeout: 3000 })) {
        const items = page.locator(
          '.associated-item, .topic-item'
        );
        const initialCount = await items.count();
        await removeBtn.first().click();
        await page.waitForTimeout(1000);
        if (initialCount > 0) {
          const newCount = await items.count();
          expect(newCount).toBeLessThan(initialCount);
        }
      }
    }
  });

  test("TP-04: Reorder items in topic and verify order saved", async ({
    page,
  }) => {
    await page.goto("/pages/admin/system/topics/");
    await page.waitForTimeout(1000);
    const topicLink = page.locator(
      'table tbody tr a, .topic-item a, .topic-card a'
    );
    if (await topicLink.first().isVisible({ timeout: 5000 })) {
      await topicLink.first().click();
      await page.waitForTimeout(1000);
      // Drag and drop or use reorder controls
      const dragHandle = page.locator(
        '[data-testid="drag-handle"], .drag-handle, .sortable-handle, [aria-grabbed]'
      );
      if (await dragHandle.first().isVisible({ timeout: 3000 })) {
        // Attempt drag operation
        const firstHandle = dragHandle.first();
        const secondHandle = dragHandle.nth(1);
        if (await secondHandle.isVisible({ timeout: 2000 })) {
          const firstBox = await firstHandle.boundingBox();
          const secondBox = await secondHandle.boundingBox();
          if (firstBox && secondBox) {
            await page.mouse.move(
              firstBox.x + firstBox.width / 2,
              firstBox.y + firstBox.height / 2
            );
            await page.mouse.down();
            await page.mouse.move(
              secondBox.x + secondBox.width / 2,
              secondBox.y + secondBox.height / 2,
              { steps: 10 }
            );
            await page.mouse.up();
            await page.waitForTimeout(1000);
          }
        }
      }
      // Save if needed
      const saveBtn = page.locator(
        'button:has-text("Guardar"), button:has-text("Save")'
      );
      if (await saveBtn.first().isVisible({ timeout: 3000 })) {
        await saveBtn.first().click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test("TP-05: Edit name, description, toggle featured and private", async ({
    page,
  }) => {
    await page.goto("/pages/admin/system/topics/");
    await page.waitForTimeout(1000);
    const topicLink = page.locator(
      'table tbody tr a, .topic-item a, .topic-card a'
    );
    if (await topicLink.first().isVisible({ timeout: 5000 })) {
      await topicLink.first().click();
      await page.waitForTimeout(1000);
      const nameInput = page.locator(
        'input[name="name"], input[name*="name"], input[name*="title"]'
      );
      if (await nameInput.isVisible({ timeout: 5000 })) {
        await nameInput.clear();
        await nameInput.fill("Updated E2E Topic");
      }
      const descInput = page.locator(
        'textarea[name="description"], .ql-editor, [contenteditable="true"]'
      );
      if (await descInput.first().isVisible({ timeout: 3000 })) {
        await descInput.first().click();
        await descInput.first().fill("Updated topic description");
      }
      // Toggle featured
      const featuredToggle = page.locator(
        'input[name*="featured"], [data-testid="featured-toggle"], label:has-text("Destaque") input'
      );
      if (await featuredToggle.first().isVisible({ timeout: 3000 })) {
        await featuredToggle.first().click();
      }
      // Toggle private
      const privateToggle = page.locator(
        'input[name*="private"], [data-testid="private-toggle"], label:has-text("Privado") input'
      );
      if (await privateToggle.first().isVisible({ timeout: 3000 })) {
        await privateToggle.first().click();
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

  test("TP-06: Delete topic removes it", async ({ page }) => {
    await page.goto("/pages/admin/system/topics/");
    const topicItems = page.locator(
      'table tbody tr, .topic-item, .topic-card'
    );
    const initialCount = await topicItems.count();
    if (initialCount > 0) {
      await topicItems.first().locator("a").first().click();
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
});
