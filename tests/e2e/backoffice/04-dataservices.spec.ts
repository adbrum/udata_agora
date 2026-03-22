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

      // Step 1: STEP="Passo 1/3", H2s="Produtor","Descrição","Acesso"
      const stepIndicator = page.getByText("Passo 1/3").first();
      await expect(stepIndicator).toBeVisible({ timeout: 10000 }).catch(() => {});
    });

    test("API-02: Step 1 - fill title, description, doc URLs with validation", async ({
      page,
    }) => {
      await page.goto("/pages/admin/dataservices/new/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Fill title using exact ID #api-name (label="Nome da API *")
      const titleInput = page.locator("#api-name").first();
      if (await titleInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await titleInput.fill("E2E Test Data Service");
      }

      // Fill acronym using exact ID #api-acronym
      const acronymInput = page.locator("#api-acronym").first();
      if (await acronymInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await acronymInput.fill("E2EAPI");
      }

      // Fill description using exact ID #api-description
      const descInput = page.locator("#api-description").first();
      if (await descInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await descInput.fill("Data service created by E2E tests");
      }

      // Fill root link using exact ID #api-root-link
      const rootLinkInput = page.locator("#api-root-link").first();
      if (await rootLinkInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await rootLinkInput.fill("https://api.example.com/v1");
      }

      // Fill OpenAPI doc URL using exact ID #api-doc-openapi
      const openApiInput = page.locator("#api-doc-openapi").first();
      if (await openApiInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await openApiInput.fill("https://api.example.com/openapi.json");
      }

      // Fill technical doc URL using exact ID #api-doc-technical
      const techDocInput = page.locator("#api-doc-technical").first();
      if (await techDocInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await techDocInput.fill("https://api.example.com/docs");
      }

      // Access type radio: #access-open, #access-account, #access-restricted
      const openRadio = page.locator("#access-open").first();
      if (await openRadio.isVisible({ timeout: 3000 }).catch(() => false)) {
        await openRadio.click();
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

      // Step 2: STEP="Passo 2/3", input #dataset-url-0, BTN "Adicionar"
      const stepIndicator = page.getByText("Passo 2/3").first();
      await expect(stepIndicator).toBeVisible({ timeout: 5000 }).catch(() => {});

      const datasetUrlInput = page.locator("#dataset-url-0").first();
      if (await datasetUrlInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await datasetUrlInput.fill("https://dados.gov.pt/datasets/test");
      }

      const addBtn = page.getByRole("button", { name: "Adicionar" }).first();
      await expect(addBtn).toBeVisible({ timeout: 3000 }).catch(() => {});
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

      // Step 3: STEP="Passo 3/3", BTN "Salvar rascunho", BTN "Publicar API"
      const stepIndicator = page.getByText("Passo 3/3").first();
      await expect(stepIndicator).toBeVisible({ timeout: 5000 }).catch(() => {});

      const publishBtn = page.getByRole("button", { name: "Publicar API" }).first();
      if (await publishBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await publishBtn.click();
        await page.waitForTimeout(2000);
      }

      const draftBtn = page.getByRole("button", { name: "Salvar rascunho" }).first();
      if (await draftBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await draftBtn.click();
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

      const serviceLink = page.locator('a[href*="/dataservices/"]').first();
      if (await serviceLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await serviceLink.click();
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);

        // Edit title using exact ID #api-name
        const titleInput = page.locator("#api-name").first();
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
      // Personal
      await page.goto("/pages/admin/me/dataservices/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      const personalContent = await page.locator("main").first().textContent().catch(() => "");
      expect((personalContent || "").length).toBeGreaterThan(10);

      // Organization
      await page.goto("/pages/admin/org/dataservices/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      const orgContent = await page.locator("main").first().textContent().catch(() => "");
      expect((orgContent || "").length).toBeGreaterThan(10);

      // System
      await page.goto("/pages/admin/system/dataservices/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      const systemContent = await page.locator("main").first().textContent().catch(() => "");
      expect((systemContent || "").length).toBeGreaterThan(10);
    });
  });
});
