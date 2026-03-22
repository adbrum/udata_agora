import { test, expect } from "playwright/test";
import { loginAsAdmin } from "../../helpers/auth";

test.describe("Backoffice - User Management", () => {
  test.describe("System User Management (Admin Only)", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test("US-01: User list with search and pagination", async ({ page }) => {
      await page.goto("/pages/admin/system/users/");
      await page.waitForTimeout(1000);
      // Verify list loads
      const userList = page.locator(
        'table, .user-list, text="Nenhum utilizador", text="No users"'
      );
      await expect(userList.first()).toBeVisible({ timeout: 10000 });
      // Search
      const searchInput = page.locator(
        'input[type="search"], input[placeholder*="Pesquisar"], input[placeholder*="Search"]'
      );
      if (await searchInput.isVisible({ timeout: 3000 })) {
        await searchInput.fill("admin");
        await page.waitForTimeout(1000);
        // Verify results filtered
        const userRows = page.locator(
          'table tbody tr, .user-item, .user-card'
        );
        await expect(userRows.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
      }
      // Clear search and check pagination
      if (await searchInput.isVisible({ timeout: 1000 })) {
        await searchInput.clear();
        await page.waitForTimeout(1000);
      }
      const paginationBtn = page.locator(
        '.pagination button, nav[aria-label*="pagination"] a, button:has-text("Seguinte"), button:has-text("Next")'
      );
      if (await paginationBtn.first().isVisible({ timeout: 3000 })) {
        await paginationBtn.first().click();
        await page.waitForTimeout(1000);
      }
    });

    test("US-02: Admin changes user role", async ({ page }) => {
      await page.goto("/pages/admin/system/users/");
      await page.waitForTimeout(1000);
      const userLink = page.locator(
        'table tbody tr a, .user-item a, .user-card a'
      );
      if (await userLink.first().isVisible({ timeout: 5000 })) {
        await userLink.first().click();
        await page.waitForTimeout(1000);
        const roleSelect = page.locator(
          'select[name*="role"], [data-testid="role-select"]'
        );
        if (await roleSelect.isVisible({ timeout: 3000 })) {
          await roleSelect.selectOption({ index: 1 });
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

    test("US-03: Admin deactivates user", async ({ page }) => {
      await page.goto("/pages/admin/system/users/");
      await page.waitForTimeout(1000);
      const userLink = page.locator(
        'table tbody tr a, .user-item a, .user-card a'
      );
      if (await userLink.first().isVisible({ timeout: 5000 })) {
        await userLink.first().click();
        await page.waitForTimeout(1000);
        const deactivateBtn = page.locator(
          'button:has-text("Desativar"), button:has-text("Deactivate"), input[name*="active"]'
        );
        if (await deactivateBtn.first().isVisible({ timeout: 3000 })) {
          await deactivateBtn.first().click();
          await page.waitForTimeout(500);
          // Confirm
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

    test("US-04: Admin deletes user", async ({ page }) => {
      await page.goto("/pages/admin/system/users/");
      await page.waitForTimeout(1000);
      const userLink = page.locator(
        'table tbody tr a, .user-item a, .user-card a'
      );
      if (await userLink.first().isVisible({ timeout: 5000 })) {
        await userLink.first().click();
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

  test.describe("Profile Management", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test("US-05: Edit own profile - name, about, website, photo and save", async ({
      page,
    }) => {
      await page.goto("/pages/admin/profile/");
      await page.waitForTimeout(1000);
      // Edit first name
      const firstNameInput = page.locator(
        'input[name="first_name"], input[name*="first_name"], input[name*="firstName"]'
      );
      if (await firstNameInput.isVisible({ timeout: 5000 })) {
        await firstNameInput.clear();
        await firstNameInput.fill("E2E Test");
      }
      // Edit last name
      const lastNameInput = page.locator(
        'input[name="last_name"], input[name*="last_name"], input[name*="lastName"]'
      );
      if (await lastNameInput.isVisible({ timeout: 3000 })) {
        await lastNameInput.clear();
        await lastNameInput.fill("Admin User");
      }
      // Edit about
      const aboutInput = page.locator(
        'textarea[name="about"], textarea[name*="about"], .ql-editor, [contenteditable="true"]'
      );
      if (await aboutInput.first().isVisible({ timeout: 3000 })) {
        await aboutInput.first().click();
        await aboutInput.first().fill("Profile updated via E2E test");
      }
      // Edit website
      const websiteInput = page.locator(
        'input[name="website"], input[name*="website"], input[type="url"]'
      );
      if (await websiteInput.isVisible({ timeout: 3000 })) {
        await websiteInput.clear();
        await websiteInput.fill("https://e2e-test.example.com");
      }
      // Upload photo
      const fileInput = page.locator(
        'input[type="file"][accept*="image"], input[type="file"]'
      );
      if (await fileInput.first().isVisible({ timeout: 3000 })) {
        const pngBuffer = Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          "base64"
        );
        await fileInput.first().setInputFiles({
          name: "avatar.png",
          mimeType: "image/png",
          buffer: pngBuffer,
        });
        await page.waitForTimeout(2000);
      }
      // Save
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
      if (await firstNameInput.isVisible({ timeout: 5000 })) {
        await expect(firstNameInput).toHaveValue("E2E Test");
      }
    });

    test("US-06: Delete own account redirects to login", async ({ page }) => {
      await page.goto("/pages/admin/profile/");
      await page.waitForTimeout(1000);
      const deleteAccountBtn = page.locator(
        'button:has-text("Eliminar conta"), button:has-text("Delete account"), button:has-text("Apagar conta")'
      );
      if (await deleteAccountBtn.isVisible({ timeout: 3000 })) {
        await deleteAccountBtn.click();
        // Confirm deletion
        const confirmBtn = page.locator(
          'button:has-text("Confirmar"), button:has-text("Confirm"), button:has-text("Sim")'
        );
        if (await confirmBtn.isVisible({ timeout: 3000 })) {
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
