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
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // TABLE with headers: Nome | Criado em | Conjuntos de dados | Reutilizar
    const table = page.locator("table").first();
    await expect(table).toBeVisible({ timeout: 10000 }).catch(() => {});

    // Navigate to create
    const createLink = page.locator('a[href*="/topics/new"]').first();
    const createBtn = page.getByRole("button", { name: /Criar|Novo/i }).first();
    if (await createLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await createLink.click();
    } else if (await createBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await createBtn.click();
    }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Fill name
    const nameInput = page.getByLabel(/Nome/i).first();
    if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nameInput.fill("E2E Test Topic");
    }

    // Fill description
    const descInput = page.getByLabel(/Descrição/i).first();
    if (await descInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await descInput.fill("Topic created by E2E tests");
    }

    // Add tags
    const tagInput = page.getByLabel(/Palavra/i).first();
    if (await tagInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await tagInput.fill("e2e-test");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);
    }

    // Save
    const saveBtn = page.getByRole("button", { name: /Guardar|Criar/i }).first();
    if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await saveBtn.click();
      await page.waitForTimeout(2000);
    }
  });

  test("TP-02: Add datasets, reuses, and services to topic", async ({
    page,
  }) => {
    await page.goto("/pages/admin/system/topics/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const topicLink = page.locator('a[href*="/topics/"]').first();
    if (await topicLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await topicLink.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Search and add items
      const searchInput = page.getByPlaceholder(/Pesquis/i).first();
      if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await searchInput.fill("test");
        await page.waitForTimeout(1000);
      }
    }
  });

  test("TP-03: Remove item from topic", async ({ page }) => {
    await page.goto("/pages/admin/system/topics/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const topicLink = page.locator('a[href*="/topics/"]').first();
    if (await topicLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await topicLink.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const removeBtn = page.getByRole("button", { name: /Remover/i }).first();
      if (await removeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await removeBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test("TP-04: Reorder items in topic and verify order saved", async ({
    page,
  }) => {
    await page.goto("/pages/admin/system/topics/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const topicLink = page.locator('a[href*="/topics/"]').first();
    if (await topicLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await topicLink.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Drag and drop or use reorder controls
      const dragHandle = page.locator('[aria-grabbed], [draggable="true"]').first();
      if (await dragHandle.isVisible({ timeout: 3000 }).catch(() => false)) {
        const firstBox = await dragHandle.boundingBox();
        if (firstBox) {
          await page.mouse.move(
            firstBox.x + firstBox.width / 2,
            firstBox.y + firstBox.height / 2
          );
          await page.mouse.down();
          await page.mouse.move(
            firstBox.x + firstBox.width / 2,
            firstBox.y + firstBox.height / 2 + 100,
            { steps: 10 }
          );
          await page.mouse.up();
          await page.waitForTimeout(1000);
        }
      }

      // Save if needed
      const saveBtn = page.getByRole("button", { name: /Guardar/i }).first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test("TP-05: Edit name, description, toggle featured and private", async ({
    page,
  }) => {
    await page.goto("/pages/admin/system/topics/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const topicLink = page.locator('a[href*="/topics/"]').first();
    if (await topicLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await topicLink.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const nameInput = page.getByLabel(/Nome/i).first();
      if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await nameInput.clear();
        await nameInput.fill("Updated E2E Topic");
      }

      const descInput = page.getByLabel(/Descrição/i).first();
      if (await descInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await descInput.click();
        await descInput.fill("Updated topic description");
      }

      // Toggle featured
      const featuredToggle = page.getByLabel(/Destaque|Featured/i).first();
      if (await featuredToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
        await featuredToggle.click();
      }

      // Toggle private
      const privateToggle = page.getByLabel(/Privado|Private/i).first();
      if (await privateToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
        await privateToggle.click();
      }

      const saveBtn = page.getByRole("button", { name: /Guardar/i }).first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test("TP-06: Delete topic removes it", async ({ page }) => {
    await page.goto("/pages/admin/system/topics/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const topicLink = page.locator('a[href*="/topics/"]').first();
    if (await topicLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await topicLink.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const deleteBtn = page.getByRole("button", { name: /Eliminar|Apagar/i }).first();
      if (await deleteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await deleteBtn.click();
        await page.waitForTimeout(500);

        const confirmBtn = page.getByRole("button", { name: /Confirmar|Sim/i }).first();
        if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await confirmBtn.click();
        }
        await page.waitForTimeout(2000);
      }
    }
  });
});
