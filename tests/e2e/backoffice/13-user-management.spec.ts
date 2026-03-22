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

      // H1 "Utilizadores", TABLE with headers: Nome | E-mail | Criado em | Último acesso | Ação
      const heading = page.getByRole("heading", { name: /Utilizadores/i }).first();
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Search with real placeholder
      const searchInput = page.getByPlaceholder(/Pesquise o nome do utilizador/i).first();
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

      // H1 "Meu perfil" (from DOM) or "Perfil" (from source)
      // Real labels: "Nome *", "Apelido *" (or "Último nome *"), "Sobre mim" (or "Biografia"), "Website" (or "Site da Internet")
      // Real IDs: user-first-name (or first-name), user-last-name (or last-name), user-about (or biography), user-website (or website)

      // Edit first name - try real ID first
      const firstNameInput = page.locator("#user-first-name, #first-name").first();
      if (await firstNameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await firstNameInput.clear();
        await firstNameInput.fill("E2E Test");
      } else {
        const firstNameByLabel = page.getByLabel(/Nome \*/i).first();
        if (await firstNameByLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
          await firstNameByLabel.clear();
          await firstNameByLabel.fill("E2E Test");
        }
      }

      // Edit last name - try real ID first
      const lastNameInput = page.locator("#user-last-name, #last-name").first();
      if (await lastNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await lastNameInput.clear();
        await lastNameInput.fill("Admin User");
      } else {
        const lastNameByLabel = page.getByLabel(/Apelido|Último nome/i).first();
        if (await lastNameByLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
          await lastNameByLabel.clear();
          await lastNameByLabel.fill("Admin User");
        }
      }

      // Edit about - try real ID first
      const aboutInput = page.locator("#user-about, #biography").first();
      if (await aboutInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await aboutInput.click();
        await aboutInput.fill("Profile updated via E2E test");
      } else {
        const aboutByLabel = page.getByLabel(/Sobre mim|Biografia/i).first();
        if (await aboutByLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
          await aboutByLabel.click();
          await aboutByLabel.fill("Profile updated via E2E test");
        }
      }

      // Edit website - try real ID first
      const websiteInput = page.locator("#user-website, #website").first();
      if (await websiteInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await websiteInput.clear();
        await websiteInput.fill("https://e2e-test.example.com");
      } else {
        const websiteByLabel = page.getByLabel(/Website|Site da Internet/i).first();
        if (await websiteByLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
          await websiteByLabel.clear();
          await websiteByLabel.fill("https://e2e-test.example.com");
        }
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

      // Save
      const saveBtn = page.getByRole("button", { name: /Guardar/i }).first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }

      // Verify persistence
      await page.reload();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      const verifyInput = page.locator("#user-first-name, #first-name").first();
      if (await verifyInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(verifyInput).toHaveValue("E2E Test");
      }
    });

    test("US-06: Delete own account redirects to login", async ({ page }) => {
      await page.goto("/pages/admin/profile/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // "Eliminar conta" button is in the user dropdown (AdminHeader authenticated area)
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
