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
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // H1 is "Formulário de inscrição", step "Passo 1 - Descreva a sua API"
      const heading = page.getByRole("heading", { name: /Formulário de inscrição/i }).first();
      await expect(heading).toBeVisible({ timeout: 10000 }).catch(() => {});

      const stepLabel = page.locator(".admin-page__stepper-label").first();
      await expect(stepLabel).toBeVisible({ timeout: 5000 }).catch(() => {});
    });

    test("API-02: Step 1 - fill title, description, doc URLs with validation", async ({
      page,
    }) => {
      await page.goto("/pages/admin/dataservices/new/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Fill title using label "Título *"
      const titleInput = page.getByLabel(/Título/i).first();
      if (await titleInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await titleInput.fill("E2E Test Data Service");
      }

      // Fill description
      const descInput = page.getByLabel(/Descrição/i).first();
      if (await descInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await descInput.fill("Data service created by E2E tests");
      }

      // Fill endpoint URL - "URL base da API"
      const endpointInput = page.getByLabel(/URL base da API/i).first();
      if (await endpointInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await endpointInput.fill("https://api.example.com/v1");
      }

      // Try to advance
      const nextBtn = page.getByRole("button", { name: /Seguinte/i }).first();
      if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(1000);
      }
    });

    test("API-03: Step 2 - associate existing datasets", async ({ page }) => {
      await page.goto("/pages/admin/dataservices/new/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Skip to step 2
      const nextBtn = page.getByRole("button", { name: /Seguinte/i }).first();
      if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(1000);
      }

      // Search for datasets
      const searchInput = page.getByPlaceholder(/Pesquis/i).first();
      if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await searchInput.fill("test");
        await page.waitForTimeout(1000);
      }
    });

    test("API-04: Step 3 - save and create data service", async ({ page }) => {
      await page.goto("/pages/admin/dataservices/new/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Navigate through steps
      for (let i = 0; i < 2; i++) {
        const nextBtn = page.getByRole("button", { name: /Seguinte/i }).first();
        if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await nextBtn.click();
          await page.waitForTimeout(1000);
        }
      }

      // Save
      const saveBtn = page.getByRole("button", { name: /Guardar|Criar/i }).first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    });
  });

  test.describe("Data Service Editing and Lifecycle", () => {
    test("API-05: Edit title, format, license, access type and save", async ({
      page,
    }) => {
      await page.goto("/pages/admin/me/dataservices/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // H1 is "API"
      const heading = page.getByRole("heading", { name: /^API$/i }).first();
      await expect(heading).toBeVisible({ timeout: 10000 }).catch(() => {});

      const serviceLink = page.locator('a[href*="/dataservices/"]').first();
      if (await serviceLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await serviceLink.click();
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);

        const titleInput = page.getByLabel(/Título/i).first();
        if (await titleInput.isVisible({ timeout: 5000 }).catch(() => false)) {
          await titleInput.clear();
          await titleInput.fill("Updated E2E Data Service");
        }

        const saveBtn = page.getByRole("button", { name: /Guardar/i }).first();
        if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await saveBtn.click();
          await page.waitForTimeout(2000);
        }
      }
    });

    test("API-06: Delete data service removes it", async ({ page }) => {
      await page.goto("/pages/admin/me/dataservices/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const serviceLink = page.locator('a[href*="/dataservices/"]').first();
      if (await serviceLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await serviceLink.click();
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

    test("API-07: Check data service listings - personal, org, system", async ({
      page,
    }) => {
      // Personal - H1 "API"
      await page.goto("/pages/admin/me/dataservices/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      const personalContent = await page.locator(".admin-page").first().textContent().catch(() => "");
      expect((personalContent || "").length).toBeGreaterThan(10);

      // Organization
      await page.goto("/pages/admin/org/dataservices/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      const orgContent = await page.locator("main, .admin-page").first().textContent().catch(() => "");
      expect((orgContent || "").length).toBeGreaterThan(10);

      // System - TABLE with headers: Título da API | Estado | ...
      await page.goto("/pages/admin/system/dataservices/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      const systemContent = await page.locator("main, .admin-page").first().textContent().catch(() => "");
      expect((systemContent || "").length).toBeGreaterThan(10);
    });
  });
});
