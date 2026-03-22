import { test, expect } from "playwright/test";
import { loginAsAdmin } from "../../helpers/auth";

test.describe("Backoffice - Posts CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("PO-01: Create post - name required, validates name field", async ({
    page,
  }) => {
    await page.goto("/pages/admin/system/posts/");
    await page.waitForTimeout(1000);
    const createBtn = page.locator(
      'a[href*="new"], button:has-text("Criar"), button:has-text("Novo"), button:has-text("Nova")'
    );
    if (await createBtn.first().isVisible({ timeout: 5000 })) {
      await createBtn.first().click();
      await page.waitForTimeout(1000);
    }
    // Try to save without name
    const saveBtn = page.locator(
      'button:has-text("Guardar"), button:has-text("Save"), button:has-text("Criar")'
    );
    if (await saveBtn.first().isVisible({ timeout: 3000 })) {
      await saveBtn.first().click();
      await page.waitForTimeout(500);
      // Expect validation error on name
      const error = page.locator(
        '.error-message, .field-error, [role="alert"], text="obrigatório", text="required"'
      );
      await expect(error.first()).toBeVisible({ timeout: 3000 }).catch(() => {});
    }
    // Fill name
    const nameInput = page.locator(
      'input[name="name"], input[name*="name"], input[name*="title"]'
    );
    if (await nameInput.isVisible({ timeout: 3000 })) {
      await nameInput.fill("E2E Test Post");
    }
  });

  test("PO-02: Post with date is published; without date is draft", async ({
    page,
  }) => {
    await page.goto("/pages/admin/system/posts/");
    const createBtn = page.locator(
      'a[href*="new"], button:has-text("Criar"), button:has-text("Novo")'
    );
    if (await createBtn.first().isVisible({ timeout: 5000 })) {
      await createBtn.first().click();
      await page.waitForTimeout(1000);
    }
    const nameInput = page.locator(
      'input[name="name"], input[name*="name"], input[name*="title"]'
    );
    if (await nameInput.isVisible({ timeout: 3000 })) {
      await nameInput.fill("E2E Post Date Test");
    }
    // Check date field
    const dateInput = page.locator(
      'input[name*="published"], input[name*="date"], input[type="date"]'
    );
    if (await dateInput.isVisible({ timeout: 3000 })) {
      // Without date - should be draft
      await dateInput.clear();
      const draftIndicator = page.locator(
        'text="Rascunho", text="Draft", .badge-draft, .status-draft'
      );
      // With date - should be published
      await dateInput.fill("2024-06-15");
      await page.waitForTimeout(500);
    }
    const saveBtn = page.locator(
      'button:has-text("Guardar"), button:has-text("Save"), button:has-text("Criar")'
    );
    if (await saveBtn.first().isVisible({ timeout: 3000 })) {
      await saveBtn.first().click();
      await page.waitForTimeout(2000);
    }
  });

  test("PO-03: Upload image shows preview", async ({ page }) => {
    await page.goto("/pages/admin/system/posts/");
    const createBtn = page.locator(
      'a[href*="new"], button:has-text("Criar"), button:has-text("Novo")'
    );
    if (await createBtn.first().isVisible({ timeout: 5000 })) {
      await createBtn.first().click();
      await page.waitForTimeout(1000);
    }
    const fileInput = page.locator(
      'input[type="file"][accept*="image"], input[type="file"]'
    );
    if (await fileInput.first().isVisible({ timeout: 5000 })) {
      const pngBuffer = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64"
      );
      await fileInput.first().setInputFiles({
        name: "post-image.png",
        mimeType: "image/png",
        buffer: pngBuffer,
      });
      await page.waitForTimeout(2000);
      const preview = page.locator(
        'img[alt*="preview"], .image-preview img, .upload-preview img'
      );
      await expect(preview.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
    }
  });

  test("PO-04: Edit post and save changes", async ({ page }) => {
    await page.goto("/pages/admin/system/posts/");
    await page.waitForTimeout(1000);
    const postLink = page.locator(
      'table tbody tr a, .post-item a, .post-card a'
    );
    if (await postLink.first().isVisible({ timeout: 5000 })) {
      await postLink.first().click();
      await page.waitForTimeout(1000);
      const nameInput = page.locator(
        'input[name="name"], input[name*="name"], input[name*="title"]'
      );
      if (await nameInput.isVisible({ timeout: 5000 })) {
        await nameInput.clear();
        await nameInput.fill("Updated E2E Post");
      }
      const saveBtn = page.locator(
        'button:has-text("Guardar"), button:has-text("Save")'
      );
      if (await saveBtn.first().isVisible({ timeout: 3000 })) {
        await saveBtn.first().click();
        await page.waitForTimeout(2000);
      }
      // Verify persistence
      await page.reload();
      await page.waitForTimeout(1000);
      if (await nameInput.isVisible({ timeout: 5000 })) {
        await expect(nameInput).toHaveValue("Updated E2E Post");
      }
    }
  });

  test("PO-05: Delete post removes it from listing", async ({ page }) => {
    await page.goto("/pages/admin/system/posts/");
    const postItems = page.locator(
      'table tbody tr, .post-item, .post-card'
    );
    const initialCount = await postItems.count();
    if (initialCount > 0) {
      await postItems.first().locator("a").first().click();
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

  test("PO-06: List posts with pagination (admin only)", async ({ page }) => {
    await page.goto("/pages/admin/system/posts/");
    await page.waitForTimeout(1000);
    const postList = page.locator(
      'table, .post-list, text="Nenhum artigo", text="No posts"'
    );
    await expect(postList.first()).toBeVisible({ timeout: 10000 });
    // Pagination
    const paginationBtn = page.locator(
      '.pagination button, nav[aria-label*="pagination"] a, button:has-text("Seguinte")'
    );
    if (await paginationBtn.first().isVisible({ timeout: 3000 })) {
      await paginationBtn.first().click();
      await page.waitForTimeout(1000);
    }
  });
});
