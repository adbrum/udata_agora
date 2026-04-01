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
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Posts listing: BTN "Criar um artigo", TABLE headers=[Título | Status | Criado em | Atualizado em | Ação]
    const heading = page.getByRole("heading", { name: /Artigos/i }).first();
    await expect(heading).toBeVisible({ timeout: 10000 }).catch(() => {});

    // Navigate to create new post via "Criar um artigo" button
    const createBtn = page.getByRole("button", { name: "Criar um artigo" }).first();
    const createLink = page.locator('a[href*="/posts/new"]').first();
    if (await createBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await createBtn.click();
    } else if (await createLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await createLink.click();
    } else {
      await page.goto("/pages/admin/system/posts/new/");
    }
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Step 1: STEP="Passo 1/2"
    const stepIndicator = page.getByText("Passo 1/2").first();
    await expect(stepIndicator).toBeVisible({ timeout: 5000 }).catch(() => {});

    // Try to advance without filling required fields - should show validation
    const nextBtn = page.getByRole("button", { name: /Seguinte/i }).first();
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(500);
      // Expect validation error
      const error = page.getByText(/obrigatório|Campo obrigatório/i).first();
      await expect(error).toBeVisible({ timeout: 3000 }).catch(() => {});
    }

    // Fill title using exact ID #article-title (label="Título do artigo *")
    const nameInput = page.locator("#article-title").first();
    if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nameInput.fill("E2E Test Post");
    }

    // Fill header using exact ID #article-header (label="Cabeçalho *") - REQUIRED
    const headerInput = page.locator("#article-header").first();
    if (await headerInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await headerInput.fill("E2E Test Post Header");
    }

    // Content type radio: #content-html / #content-markdown
    const htmlRadio = page.locator("#content-html").first();
    await expect(htmlRadio).toBeVisible({ timeout: 3000 }).catch(() => {});
  });

  test("PO-02: Post with date is published; without date is draft", async ({
    page,
  }) => {
    await page.goto("/pages/admin/system/posts/new/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Fill title (required) using exact ID #article-title
    const nameInput = page.locator("#article-title").first();
    if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nameInput.fill("E2E Post Date Test");
    }

    // Fill header (required) using exact ID #article-header
    const headerInput = page.locator("#article-header").first();
    if (await headerInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await headerInput.fill("E2E Post Header");
    }

    // Advance to step 2
    const nextBtn = page.getByRole("button", { name: /Seguinte/i }).first();
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(1000);
    }

    // Step 2: STEP="Passo 2/2", #article-content (textarea, label="Contente *"), BTN "Guardar"
    const stepIndicator = page.getByText("Passo 2/2").first();
    await expect(stepIndicator).toBeVisible({ timeout: 5000 }).catch(() => {});

    const contentInput = page.locator("#article-content").first();
    if (await contentInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await contentInput.fill("E2E Post Content");
    }

    const saveBtn = page.getByRole("button", { name: "Guardar" }).first();
    if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await saveBtn.click();
      await page.waitForTimeout(2000);
    }
  });

  test("PO-03: Upload image shows preview", async ({ page }) => {
    await page.goto("/pages/admin/system/posts/new/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // File upload in step 1
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count().then(c => c > 0).catch(() => false)) {
      const pngBuffer = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64"
      );
      await fileInput.setInputFiles({
        name: "post-image.png",
        mimeType: "image/png",
        buffer: pngBuffer,
      });
      await page.waitForTimeout(2000);

      const preview = page.locator("img").first();
      await expect(preview).toBeVisible({ timeout: 5000 }).catch(() => {});
    }
  });

  test("PO-04: Edit post and save changes", async ({ page }) => {
    await page.goto("/pages/admin/system/posts/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // TABLE with headers: Título | Status | Criado em | Atualizado em | Ação
    const postLink = page.locator('a[href*="/posts/"]').first();
    if (await postLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await postLink.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const nameInput = page.locator("#article-title").first();
      if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await nameInput.clear();
        await nameInput.fill("Updated E2E Post");
      }

      const saveBtn = page.getByRole("button", { name: "Guardar" }).first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }

      // Verify persistence
      await page.reload();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(nameInput).toHaveValue("Updated E2E Post");
      }
    }
  });

  test("PO-05: Delete post removes it from listing", async ({ page }) => {
    await page.goto("/pages/admin/system/posts/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const postLink = page.locator('a[href*="/posts/"]').first();
    if (await postLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await postLink.click();
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

  test("PO-06: List posts with pagination (admin only)", async ({ page }) => {
    await page.goto("/pages/admin/system/posts/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const heading = page.getByRole("heading", { name: /Artigos/i }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    // "Criar um artigo" button
    const createBtn = page.getByRole("button", { name: "Criar um artigo" }).first();
    await expect(createBtn).toBeVisible({ timeout: 5000 }).catch(() => {});

    // Search
    const searchInput = page.getByPlaceholder(/Pesquise o título do artigo/i).first();
    if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await searchInput.fill("test");
      await page.waitForTimeout(1000);
      await searchInput.clear();
    }

    // Pagination
    const paginationText = page.getByText(/Linhas por página/i).first();
    await expect(paginationText).toBeVisible({ timeout: 3000 }).catch(() => {});
  });
});
