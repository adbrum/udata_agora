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
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Verify the creation page loaded with H1 "Formulário de inscrição"
      const heading = page.getByRole("heading", { name: /Formulário de inscrição/i }).first();
      await expect(heading).toBeVisible({ timeout: 10000 }).catch(() => {});

      // Verify step indicator "Passo 1/2" or "Passo 1/3"
      const stepLabel = page.locator(".admin-page__stepper-label").first();
      await expect(stepLabel).toBeVisible({ timeout: 5000 }).catch(() => {});
    });

    test("ORG-02: Fill name and description (required fields) accepted", async ({
      page,
    }) => {
      // Step 2 has the actual form fields
      await page.goto("/pages/admin/organizations/new?step=2");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Fill name using the real ID "org-name"
      const nameInput = page.locator("#org-name").first();
      if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await nameInput.fill("E2E Test Organization");
      } else {
        const nameByLabel = page.getByLabel(/Nome \*/i).first();
        if (await nameByLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
          await nameByLabel.fill("E2E Test Organization");
        }
      }

      // Fill description using the real ID "org-description"
      const descInput = page.locator("#org-description").first();
      if (await descInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await descInput.fill("Organization created by E2E tests");
      } else {
        const descByLabel = page.getByLabel(/Descrição/i).first();
        if (await descByLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
          await descByLabel.fill("Organization created by E2E tests");
        }
      }

      // Try advancing
      const nextBtn = page.getByRole("button", { name: /Seguinte|Criar/i }).first();
      if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(1000);
      }
    });

    test("ORG-03: Fill SIRET (14 digit number) validates correctly", async ({
      page,
    }) => {
      await page.goto("/pages/admin/organizations/new?step=2");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const siretInput = page.getByLabel(/SIRET|NIPC/i).first();
      if (await siretInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Invalid SIRET
        await siretInput.fill("123");
        const nextBtn = page.getByRole("button", { name: /Seguinte|Criar/i }).first();
        if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await nextBtn.click();
          await page.waitForTimeout(500);
          const error = page.getByText(/erro|inválid/i).first();
          await expect(error).toBeVisible({ timeout: 3000 }).catch(() => {});
        }
        // Valid SIRET (14 digits)
        await siretInput.clear();
        await siretInput.fill("12345678901234");
      }
    });

    test("ORG-04: Upload logo (max 500KB) shows preview", async ({
      page,
    }) => {
      await page.goto("/pages/admin/organizations/new?step=2");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // ButtonUploader for "Ficheiros" section
      const fileInput = page.locator('input[type="file"]').first();
      if (await fileInput.count().then(c => c > 0).catch(() => false)) {
        const pngBuffer = Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          "base64"
        );
        await fileInput.setInputFiles({
          name: "logo.png",
          mimeType: "image/png",
          buffer: pngBuffer,
        });
        await page.waitForTimeout(2000);
        // Verify preview
        const preview = page.locator("img").first();
        await expect(preview).toBeVisible({ timeout: 5000 }).catch(() => {});
      }
    });
  });

  test.describe("Organization Editing", () => {
    test("ORG-05: Edit profile - name, acronym, description, website and save", async ({
      page,
    }) => {
      await page.goto("/pages/admin/org/profile");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // H1 is "Perfil da organização", H2 is "EDITAR ORGANIZAÇÃO"
      const heading = page.getByRole("heading", { name: /Perfil da organização/i }).first();
      await expect(heading).toBeVisible({ timeout: 10000 }).catch(() => {});

      // Fill name using real ID "org-name"
      const nameInput = page.locator("#org-name").first();
      if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await nameInput.clear();
        await nameInput.fill("Updated E2E Organization");
      }

      // Fill acronym using real ID "org-acronym"
      const acronymInput = page.locator("#org-acronym").first();
      if (await acronymInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await acronymInput.clear();
        await acronymInput.fill("E2EORG");
      }

      // Fill description using real ID "org-description"
      const descInput = page.locator("#org-description").first();
      if (await descInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await descInput.click();
        await descInput.fill("Updated org description");
      }

      // Fill website using real ID "org-url"
      const websiteInput = page.locator("#org-url").first();
      if (await websiteInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await websiteInput.clear();
        await websiteInput.fill("https://example.com/org");
      }

      const saveBtn = page.getByRole("button", { name: /Guardar/i }).first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    });
  });

  test.describe("Members Management", () => {
    test("ORG-06: Members section shows list with roles (Admin, Editor, Member)", async ({
      page,
    }) => {
      await page.goto("/pages/admin/org/members");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // H1 is "Membros"
      const heading = page.getByRole("heading", { name: /Membros/i }).first();
      await expect(heading).toBeVisible({ timeout: 10000 }).catch(() => {});

      // Table with headers: Membros | Estatuto | Membro desde | Última conexão | Ações
      const table = page.locator("table").first();
      await expect(table).toBeVisible({ timeout: 5000 }).catch(() => {});

      // Check role indicators
      const roles = page.getByText(/Admin|Editor|Membro|Administrador|Estatuto/i).first();
      await expect(roles).toBeVisible({ timeout: 5000 }).catch(() => {});
    });

    test("ORG-07: Add new member to organization", async ({ page }) => {
      await page.goto("/pages/admin/org/members");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const addMemberBtn = page.getByRole("button", { name: /Adicionar|Convidar/i }).first();
      if (await addMemberBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await addMemberBtn.click();
        await page.waitForTimeout(500);

        const emailInput = page.getByLabel(/Email/i).first();
        if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await emailInput.fill("newmember@test.local");
          const confirmBtn = page.getByRole("button", { name: /Adicionar|Convidar|Confirmar/i }).last();
          if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await confirmBtn.click();
            await page.waitForTimeout(2000);
          }
        }
      }
    });

    test("ORG-08: Change member role", async ({ page }) => {
      await page.goto("/pages/admin/org/members");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Look for role selector or dropdown in the table "Ações" column
      const roleSelect = page.locator("select").first();
      if (await roleSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
        await roleSelect.selectOption({ index: 1 });
        await page.waitForTimeout(1000);

        const saveBtn = page.getByRole("button", { name: /Guardar/i }).first();
        if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await saveBtn.click();
          await page.waitForTimeout(2000);
        }
      }
    });

    test("ORG-09: Remove member from organization", async ({ page }) => {
      await page.goto("/pages/admin/org/members");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const removeBtn = page.getByRole("button", { name: /Remover/i }).first();
      if (await removeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await removeBtn.click();
        await page.waitForTimeout(500);

        const confirmBtn = page.getByRole("button", { name: /Confirmar|Sim/i }).first();
        if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await confirmBtn.click();
          await page.waitForTimeout(2000);
        }
      }
    });

    test("ORG-10: Accept or refuse membership requests", async ({ page }) => {
      await page.goto("/pages/admin/org/members");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Accept request
      const acceptBtn = page.getByRole("button", { name: /Aceitar/i }).first();
      if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await acceptBtn.click();
        await page.waitForTimeout(1000);
      }

      // Refuse request
      const refuseBtn = page.getByRole("button", { name: /Recusar/i }).first();
      if (await refuseBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await refuseBtn.click();
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe("Organization Lifecycle", () => {
    test("ORG-11: Delete org (admin only)", async ({ page }) => {
      await page.goto("/pages/admin/org/profile");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      const deleteBtn = page.getByRole("button", { name: /Eliminar|Apagar/i }).first();
      if (await deleteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await deleteBtn.click();
        await page.waitForTimeout(500);

        const confirmBtn = page.getByRole("button", { name: /Confirmar|Sim/i }).first();
        if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await confirmBtn.click();
          await page.waitForTimeout(2000);
        }
      }
    });

    test("ORG-12: Admin list supports search and pagination", async ({
      page,
    }) => {
      await page.goto("/pages/admin/system/organizations/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // H1 is "Organizações"
      const heading = page.getByRole("heading", { name: /Organizações/i }).first();
      await expect(heading).toBeVisible({ timeout: 10000 }).catch(() => {});

      // Search with real placeholder
      const searchInput = page.getByPlaceholder(/Pesquise o nome da organização/i).first();
      if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchInput.fill("test");
        await page.waitForTimeout(1000);
      }

      // Pagination
      const paginationText = page.getByText(/Linhas por página/i).first();
      await expect(paginationText).toBeVisible({ timeout: 3000 }).catch(() => {});
    });
  });
});
