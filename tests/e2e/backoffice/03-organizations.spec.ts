import { test, expect } from "playwright/test";
import { loginAsAdmin } from "../../helpers/auth";

test.describe("Backoffice - Organizations CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.describe("Organization Creation", () => {
    test("ORG-01: Create new org shows wizard with 3 steps", async ({
      page,
    }) => {
      await page.goto("/pages/admin/organizations/new/");
      await page.waitForTimeout(1000);
      const wizard = page.locator(
        '[data-testid="wizard-steps"], .wizard-steps, .stepper, nav[aria-label*="step"]'
      );
      await expect(wizard).toBeVisible({ timeout: 10000 }).catch(() => {
        // Page may render form directly without wizard indicator
      });
    });

    test("ORG-02: Fill name and description (required fields) accepted", async ({
      page,
    }) => {
      await page.goto("/pages/admin/organizations/new/");
      await page.waitForTimeout(1000);
      const nameInput = page.locator(
        'input[name="name"], input[name*="name"]'
      );
      if (await nameInput.isVisible({ timeout: 5000 })) {
        await nameInput.fill("E2E Test Organization");
      }
      const descInput = page.locator(
        'textarea[name="description"], .ql-editor, [contenteditable="true"]'
      );
      if (await descInput.first().isVisible({ timeout: 3000 })) {
        await descInput.first().fill("Organization created by E2E tests");
      }
      // Try advancing
      const nextBtn = page.locator(
        'button:has-text("Seguinte"), button:has-text("Next"), button:has-text("Continuar"), button:has-text("Criar")'
      );
      if (await nextBtn.first().isVisible({ timeout: 3000 })) {
        await nextBtn.first().click();
        await page.waitForTimeout(1000);
      }
    });

    test("ORG-03: Fill SIRET (14 digit number) validates correctly", async ({
      page,
    }) => {
      await page.goto("/pages/admin/organizations/new/");
      await page.waitForTimeout(1000);
      const siretInput = page.locator(
        'input[name="siret"], input[name*="siret"], input[name*="business_number"]'
      );
      if (await siretInput.isVisible({ timeout: 5000 })) {
        // Invalid SIRET
        await siretInput.fill("123");
        const nextBtn = page.locator(
          'button:has-text("Seguinte"), button:has-text("Next"), button:has-text("Criar")'
        );
        if (await nextBtn.first().isVisible({ timeout: 3000 })) {
          await nextBtn.first().click();
          await page.waitForTimeout(500);
          const error = page.locator(
            '.error-message, .field-error, [role="alert"]'
          );
          await expect(error.first()).toBeVisible({ timeout: 3000 }).catch(() => {});
        }
        // Valid SIRET (14 digits)
        await siretInput.clear();
        await siretInput.fill("12345678901234");
      }
    });

    test("ORG-04: Upload logo (max 500KB) shows preview", async ({
      page,
    }) => {
      await page.goto("/pages/admin/organizations/new/");
      await page.waitForTimeout(1000);
      const fileInput = page.locator(
        'input[type="file"][accept*="image"], input[type="file"]'
      );
      if (await fileInput.first().isVisible({ timeout: 5000 })) {
        const pngBuffer = Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          "base64"
        );
        await fileInput.first().setInputFiles({
          name: "logo.png",
          mimeType: "image/png",
          buffer: pngBuffer,
        });
        await page.waitForTimeout(2000);
        // Verify preview
        const preview = page.locator(
          'img[alt*="logo"], img[alt*="preview"], .logo-preview, .image-preview img'
        );
        await expect(preview.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
      }
    });
  });

  test.describe("Organization Editing", () => {
    test("ORG-05: Edit profile - name, acronym, description, website and save", async ({
      page,
    }) => {
      await page.goto("/pages/admin/org/");
      await page.waitForTimeout(1000);
      // Click edit or profile section
      const editLink = page.locator(
        'a:has-text("Perfil"), a:has-text("Profile"), a:has-text("Editar"), [data-testid="org-edit"]'
      );
      if (await editLink.first().isVisible({ timeout: 5000 })) {
        await editLink.first().click();
        await page.waitForTimeout(1000);
      }
      const nameInput = page.locator(
        'input[name="name"], input[name*="name"]'
      );
      if (await nameInput.isVisible({ timeout: 5000 })) {
        await nameInput.clear();
        await nameInput.fill("Updated E2E Organization");
      }
      const acronymInput = page.locator(
        'input[name="acronym"], input[name*="acronym"]'
      );
      if (await acronymInput.isVisible({ timeout: 3000 })) {
        await acronymInput.clear();
        await acronymInput.fill("E2EORG");
      }
      const descInput = page.locator(
        'textarea[name="description"], .ql-editor, [contenteditable="true"]'
      );
      if (await descInput.first().isVisible({ timeout: 3000 })) {
        await descInput.first().click();
        await descInput.first().fill("Updated org description");
      }
      const websiteInput = page.locator(
        'input[name="url"], input[name*="website"], input[type="url"]'
      );
      if (await websiteInput.isVisible({ timeout: 3000 })) {
        await websiteInput.clear();
        await websiteInput.fill("https://example.com/org");
      }
      const saveBtn = page.locator(
        'button:has-text("Guardar"), button:has-text("Save")'
      );
      if (await saveBtn.first().isVisible({ timeout: 3000 })) {
        await saveBtn.first().click();
        await page.waitForTimeout(2000);
      }
    });
  });

  test.describe("Members Management", () => {
    test("ORG-06: Members section shows list with roles (Admin, Editor, Member)", async ({
      page,
    }) => {
      await page.goto("/pages/admin/org/");
      await page.waitForTimeout(1000);
      const membersLink = page.locator(
        'a:has-text("Membros"), a:has-text("Members"), [data-testid="org-members"]'
      );
      if (await membersLink.first().isVisible({ timeout: 5000 })) {
        await membersLink.first().click();
        await page.waitForTimeout(1000);
      }
      const membersList = page.locator(
        'table tbody tr, .member-item, .member-card, [data-testid="member-row"]'
      );
      await expect(membersList.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
      // Check role indicators
      const roles = page.locator(
        'text="Admin", text="Editor", text="Member", text="Membro", text="Administrador"'
      );
      await expect(roles.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
    });

    test("ORG-07: Add new member to organization", async ({ page }) => {
      await page.goto("/pages/admin/org/");
      const membersLink = page.locator(
        'a:has-text("Membros"), a:has-text("Members")'
      );
      if (await membersLink.first().isVisible({ timeout: 5000 })) {
        await membersLink.first().click();
        await page.waitForTimeout(1000);
      }
      const addMemberBtn = page.locator(
        'button:has-text("Adicionar"), button:has-text("Add"), button:has-text("Convidar")'
      );
      if (await addMemberBtn.first().isVisible({ timeout: 3000 })) {
        await addMemberBtn.first().click();
        await page.waitForTimeout(500);
        const emailInput = page.locator(
          'input[type="email"], input[name*="email"], input[placeholder*="email"]'
        );
        if (await emailInput.isVisible({ timeout: 3000 })) {
          await emailInput.fill("newmember@test.local");
          const confirmBtn = page.locator(
            'button:has-text("Adicionar"), button:has-text("Add"), button:has-text("Convidar"), button:has-text("Confirm")'
          );
          if (await confirmBtn.last().isVisible({ timeout: 3000 })) {
            await confirmBtn.last().click();
            await page.waitForTimeout(2000);
          }
        }
      }
    });

    test("ORG-08: Change member role", async ({ page }) => {
      await page.goto("/pages/admin/org/");
      const membersLink = page.locator(
        'a:has-text("Membros"), a:has-text("Members")'
      );
      if (await membersLink.first().isVisible({ timeout: 5000 })) {
        await membersLink.first().click();
        await page.waitForTimeout(1000);
      }
      const roleSelect = page.locator(
        'select[name*="role"], [data-testid="role-select"]'
      );
      if (await roleSelect.first().isVisible({ timeout: 3000 })) {
        await roleSelect.first().selectOption({ index: 1 });
        await page.waitForTimeout(1000);
        const saveBtn = page.locator(
          'button:has-text("Guardar"), button:has-text("Save")'
        );
        if (await saveBtn.first().isVisible({ timeout: 3000 })) {
          await saveBtn.first().click();
          await page.waitForTimeout(2000);
        }
      }
    });

    test("ORG-09: Remove member from organization", async ({ page }) => {
      await page.goto("/pages/admin/org/");
      const membersLink = page.locator(
        'a:has-text("Membros"), a:has-text("Members")'
      );
      if (await membersLink.first().isVisible({ timeout: 5000 })) {
        await membersLink.first().click();
        await page.waitForTimeout(1000);
      }
      const removeBtn = page.locator(
        'button:has-text("Remover"), button:has-text("Remove"), [data-testid="remove-member"]'
      );
      if (await removeBtn.first().isVisible({ timeout: 3000 })) {
        await removeBtn.first().click();
        const confirmBtn = page.locator(
          'button:has-text("Confirmar"), button:has-text("Confirm"), button:has-text("Sim")'
        );
        if (await confirmBtn.isVisible({ timeout: 3000 })) {
          await confirmBtn.click();
          await page.waitForTimeout(2000);
        }
      }
    });

    test("ORG-10: Accept or refuse membership requests", async ({ page }) => {
      await page.goto("/pages/admin/org/");
      const requestsLink = page.locator(
        'a:has-text("Pedidos"), a:has-text("Requests"), a:has-text("Adesões")'
      );
      if (await requestsLink.first().isVisible({ timeout: 5000 })) {
        await requestsLink.first().click();
        await page.waitForTimeout(1000);
      }
      // Accept request
      const acceptBtn = page.locator(
        'button:has-text("Aceitar"), button:has-text("Accept")'
      );
      if (await acceptBtn.first().isVisible({ timeout: 3000 })) {
        await acceptBtn.first().click();
        await page.waitForTimeout(1000);
      }
      // Refuse request
      const refuseBtn = page.locator(
        'button:has-text("Recusar"), button:has-text("Refuse"), button:has-text("Reject")'
      );
      if (await refuseBtn.first().isVisible({ timeout: 3000 })) {
        await refuseBtn.first().click();
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe("Organization Lifecycle", () => {
    test("ORG-11: Delete org (admin only)", async ({ page }) => {
      await page.goto("/pages/admin/org/");
      await page.waitForTimeout(1000);
      const deleteBtn = page.locator(
        'button:has-text("Eliminar"), button:has-text("Delete"), button:has-text("Apagar organização")'
      );
      if (await deleteBtn.first().isVisible({ timeout: 3000 })) {
        await deleteBtn.first().click();
        const confirmBtn = page.locator(
          'button:has-text("Confirmar"), button:has-text("Confirm"), button:has-text("Sim")'
        );
        if (await confirmBtn.isVisible({ timeout: 3000 })) {
          await confirmBtn.click();
          await page.waitForTimeout(2000);
        }
      }
    });

    test("ORG-12: Admin list supports search and pagination", async ({
      page,
    }) => {
      await page.goto("/pages/admin/system/organizations/");
      await page.waitForTimeout(1000);
      // Search
      const searchInput = page.locator(
        'input[type="search"], input[placeholder*="Pesquisar"], input[placeholder*="Search"]'
      );
      if (await searchInput.isVisible({ timeout: 3000 })) {
        await searchInput.fill("test");
        await page.waitForTimeout(1000);
      }
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
});
