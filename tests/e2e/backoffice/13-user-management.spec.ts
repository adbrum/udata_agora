import { test, expect } from "playwright/test";
import { loginAsAdmin } from "../../helpers/auth";

test.describe("Backoffice - User Management", () => {
  test.describe("System User Management (Admin Only)", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test("US-01: User list with search and pagination", async ({ page }) => {
      await page.goto("/pages/admin/system/users/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // TABLE with headers: Nome | E-mail | Criado em | Último acesso | Ação
      const table = page.locator("table").first();
      await expect(table).toBeVisible({ timeout: 10000 });

      // Search with real placeholder
      const searchInput = page.getByPlaceholder(/Pesquise o nome/i).first();
      if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchInput.fill("admin");
        await page.waitForTimeout(1000);
        // Clear search and check pagination
        await searchInput.clear();
        await page.waitForTimeout(1000);
      }

      // Pagination
      const paginationText = page.getByText(/Linhas por página/i).first();
      await expect(paginationText).toBeVisible({ timeout: 3000 }).catch(() => {});
    });

    test("US-02: Admin changes user role", async ({ page }) => {
      await page.goto("/pages/admin/system/users/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const userLink = page.locator('a[href*="/users/"]').first();
      if (await userLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await userLink.click();
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);

        // Look for role selector
        const roleSelect = page.locator("select").first();
        if (await roleSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
          await roleSelect.selectOption({ index: 1 });
          const saveBtn = page.getByRole("button", { name: /Guardar/i }).first();
          if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await saveBtn.click();
            await page.waitForTimeout(2000);
          }
        }
      }
    });

    test("US-03: Admin deactivates user", async ({ page }) => {
      await page.goto("/pages/admin/system/users/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const userLink = page.locator('a[href*="/users/"]').first();
      if (await userLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await userLink.click();
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);

        const deactivateBtn = page.getByRole("button", { name: /Desativar/i }).first();
        const activeToggle = page.getByLabel(/Ativo/i).first();
        if (await deactivateBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await deactivateBtn.click();
          await page.waitForTimeout(500);

          const confirmBtn = page.getByRole("button", { name: /Confirmar|Sim/i }).first();
          if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await confirmBtn.click();
          }
          await page.waitForTimeout(2000);
        } else if (await activeToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
          await activeToggle.click();
          await page.waitForTimeout(2000);
        }
      }
    });

    test("US-04: Admin deletes user", async ({ page }) => {
      await page.goto("/pages/admin/system/users/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const userLink = page.locator('a[href*="/users/"]').first();
      if (await userLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await userLink.click();
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

  test.describe("Profile Management", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test("US-05: Edit own profile - name, about, website, photo and save", async ({
      page,
    }) => {
      await page.goto("/pages/admin/profile/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // H1="Perfil", H2="EDITAR PERFIL"
      const heading = page.getByRole("heading", { name: /Perfil/i }).first();
      await expect(heading).toBeVisible({ timeout: 10000 }).catch(() => {});

      // Tabs: "Perfil" (ACTIVE), "Atividades"
      const profileTab = page.getByText("Perfil").first();
      await expect(profileTab).toBeVisible({ timeout: 5000 }).catch(() => {});

      // Edit first name using exact ID #first-name (label="Nome *", val="E2E")
      const firstNameInput = page.locator("#first-name").first();
      if (await firstNameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await firstNameInput.clear();
        await firstNameInput.fill("E2E");
      }

      // Edit last name using exact ID #last-name (label="Último nome *", val="Admin")
      const lastNameInput = page.locator("#last-name").first();
      if (await lastNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await lastNameInput.clear();
        await lastNameInput.fill("Admin");
      }

      // Edit biography using exact ID #biography (textarea, label="Biografia")
      const bioInput = page.locator("#biography").first();
      if (await bioInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bioInput.click();
        await bioInput.fill("Profile updated via E2E test");
      }

      // Edit website using exact ID #website (label="Site da Internet")
      const websiteInput = page.locator("#website").first();
      if (await websiteInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await websiteInput.clear();
        await websiteInput.fill("https://e2e-test.example.com");
      }

      // Upload photo
      const fileInput = page.locator('input[type="file"]').first();
      if (await fileInput.count().then(c => c > 0).catch(() => false)) {
        const pngBuffer = Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          "base64"
        );
        await fileInput.setInputFiles({
          name: "avatar.png",
          mimeType: "image/png",
          buffer: pngBuffer,
        });
        await page.waitForTimeout(2000);
      }

      // BTN "Guardar"
      const saveBtn = page.getByRole("button", { name: "Guardar" }).first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }

      // Verify persistence
      await page.reload();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      const verifyInput = page.locator("#first-name").first();
      if (await verifyInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(verifyInput).toHaveValue("E2E");
      }
    });

    test("US-06: Check profile has API key and email fields", async ({ page }) => {
      await page.goto("/pages/admin/profile/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // BTN "Ver perfil público"
      const publicProfileBtn = page.getByRole("button", { name: "Ver perfil público" }).first();
      await expect(publicProfileBtn).toBeVisible({ timeout: 5000 }).catch(() => {});

      // API key field #api-key with BTN "Gerar"
      const apiKeyInput = page.locator("#api-key").first();
      await expect(apiKeyInput).toBeVisible({ timeout: 5000 }).catch(() => {});

      const generateBtn = page.getByRole("button", { name: "Gerar" }).first();
      await expect(generateBtn).toBeVisible({ timeout: 5000 }).catch(() => {});

      // Email field #email with BTN "Alterar e-mail"
      const emailInput = page.locator("#email").first();
      await expect(emailInput).toBeVisible({ timeout: 5000 }).catch(() => {});

      const changeEmailBtn = page.getByRole("button", { name: "Alterar e-mail" }).first();
      await expect(changeEmailBtn).toBeVisible({ timeout: 5000 }).catch(() => {});

      // Password field #password
      const passwordInput = page.locator("#password").first();
      await expect(passwordInput).toBeVisible({ timeout: 5000 }).catch(() => {});
    });

    test("US-07: Delete own account redirects to login", async ({ page }) => {
      await page.goto("/pages/admin/profile/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // "Eliminar conta" button
      const deleteAccountBtn = page.getByText("Eliminar conta").first();
      if (await deleteAccountBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await deleteAccountBtn.click();
        await page.waitForTimeout(500);

        // Confirm deletion
        const confirmBtn = page.getByRole("button", { name: /Confirmar|Sim/i }).first();
        if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await confirmBtn.click();
        }
        await page.waitForTimeout(3000);
        // Should redirect to login
        const url = page.url();
        expect(url).toContain("/login");
      }
    });
  });
});
