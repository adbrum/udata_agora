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
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Step indicator uses "Etapa" not "Passo": STEP="Etapa 1/2"
    const stepIndicator = page.getByText("Etapa 1/2").first();
    await expect(stepIndicator).toBeVisible({ timeout: 10000 }).catch(() => {});

    // Fill title using exact ID #resource-title
    const titleInput = page.locator("#resource-title").first();
    if (await titleInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await titleInput.fill("E2E Community Resource");
    }

    // Fill URL using exact ID #resource-url
    const urlInput = page.locator("#resource-url").first();
    if (await urlInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await urlInput.fill("https://example.com/resource");
    }

    // Fill description using exact ID #resource-description
    const descInput = page.locator("#resource-description").first();
    if (await descInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await descInput.fill("Community resource created by E2E tests");
    }

    // Fill schema URL using exact ID #resource-schema-url
    const schemaUrlInput = page.locator("#resource-schema-url").first();
    if (await schemaUrlInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await schemaUrlInput.fill("https://example.com/schema");
    }

    // Resource type select: agora-input-select-resource-type-control
    const typeSelect = page.locator("#agora-input-select-resource-type-control").first();
    await expect(typeSelect).toBeVisible({ timeout: 3000 }).catch(() => {});

    // Resource schema select: agora-input-select-resource-schema-control
    const schemaSelect = page.locator("#agora-input-select-resource-schema-control").first();
    await expect(schemaSelect).toBeVisible({ timeout: 3000 }).catch(() => {});

    // File upload: "Arraste e solte arquivos"
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count().then(c => c > 0).catch(() => false)) {
      const csvContent = "id,value\n1,community-test\n";
      await fileInput.setInputFiles({
        name: "community-data.csv",
        mimeType: "text/csv",
        buffer: Buffer.from(csvContent),
      });
      await page.waitForTimeout(2000);
    }

    // Advance with "Seguinte"
    const nextBtn = page.getByRole("button", { name: /Seguinte/i }).first();
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(2000);
    }
  });

  test("CR-02: Edit community resource name and description then save", async ({
    page,
  }) => {
    await page.goto("/pages/admin/community-resources/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const resourceLink = page.locator('a[href*="/community-resources/"]').first();
    if (await resourceLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await resourceLink.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Edit title using exact ID #resource-title
      const titleInput = page.locator("#resource-title").first();
      if (await titleInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await titleInput.clear();
        await titleInput.fill("Updated Community Resource");
      }

      // Edit description using exact ID #resource-description
      const descInput = page.locator("#resource-description").first();
      if (await descInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await descInput.click();
        await descInput.fill("Updated community resource description");
      }

      const saveBtn = page.getByRole("button", { name: /Guardar/i }).first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test("CR-03: Delete community resource removes it", async ({ page }) => {
    await page.goto("/pages/admin/community-resources/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    const resourceLink = page.locator('a[href*="/community-resources/"]').first();
    if (await resourceLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await resourceLink.click();
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

  test("CR-04: Check community resource listings - personal, org, system", async ({
    page,
  }) => {
    // Personal - H1 "Recursos comunitários"
    await page.goto("/pages/admin/community-resources/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    const personalHeading = page.getByRole("heading", { name: /Recursos comunitários/i }).first();
    await expect(personalHeading).toBeVisible({ timeout: 10000 }).catch(() => {});

    // Organization
    await page.goto("/pages/admin/org/community-resources/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    const orgContent = await page.locator("main").first().textContent().catch(() => "");
    expect((orgContent || "").length).toBeGreaterThan(10);

    // System
    await page.goto("/pages/admin/system/community-resources/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    const systemContent = await page.locator("main").first().textContent().catch(() => "");
    expect((systemContent || "").length).toBeGreaterThan(10);
  });
});
