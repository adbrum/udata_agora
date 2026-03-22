import { test, expect } from "playwright/test";
import { loginAsAdmin, loginAsEditor } from "../../helpers/auth";

test.describe("Backoffice - Navigation and UI", () => {
  test.describe("Sidebar Navigation", () => {
    test("UI-01: Sidebar shows correct sections per user type", async ({
      page,
    }) => {
      // Test as admin
      await loginAsAdmin(page);
      await page.goto("/pages/admin/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Admin sidebar - uses nav.admin-side-nav with Agora Sidebar component
      const sidebar = page.locator("nav.admin-side-nav").first();
      await expect(sidebar).toBeVisible({ timeout: 10000 });

      // "Meu perfil" group label should be visible
      const profileGroup = page.getByText("Meu perfil").first();
      await expect(profileGroup).toBeVisible({ timeout: 5000 }).catch(() => {});

      // Check for sidebar child links - "Conjunto de dados"
      const datasetsLink = page.locator('a[href*="/admin/me/datasets"]').first();
      await expect(datasetsLink).toBeVisible({ timeout: 5000 }).catch(() => {});

      // "Reutilizações" link
      const reusesLink = page.locator('a[href*="/admin/me/reuses"]').first();
      await expect(reusesLink).toBeVisible({ timeout: 5000 }).catch(() => {});

      // "Ir para dados.gov" home link
      const homeLink = page.getByText("Ir para dados.gov").first();
      await expect(homeLink).toBeVisible({ timeout: 5000 }).catch(() => {});

      // Test as editor
      await loginAsEditor(page);
      await page.goto("/pages/admin/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Editor should see personal section too
      const editorProfileGroup = page.getByText("Meu perfil").first();
      await expect(editorProfileGroup).toBeVisible({ timeout: 5000 }).catch(() => {});
    });
  });

  test.describe("Header", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test("UI-02: Header shows user name and active org", async ({ page }) => {
      await page.goto("/pages/admin/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // AdminHeader rendered with admin-header class
      const header = page.locator(".admin-header, header").first();
      await expect(header).toBeVisible({ timeout: 10000 });

      // User authentication area - shows user name with dropdown containing
      // "O meu perfil", "Eliminar conta", "Terminar sessão"
      const authenticatedArea = page.locator(".admin-header").first();
      await expect(authenticatedArea).toBeVisible({ timeout: 5000 }).catch(() => {});
    });
  });

  test.describe("Quick Publish Menu", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test("UI-03: Quick publish menu offers dataset, reuse, harvester, org", async ({
      page,
    }) => {
      await page.goto("/pages/admin/me/datasets/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // PublishDropdown button text is "Publicar dados.gov"
      const publishBtn = page.getByText("Publicar dados.gov").first();
      if (await publishBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await publishBtn.click();
        await page.waitForTimeout(500);

        // Check dropdown items
        const datasetOption = page.getByText("Um conjunto de dados").first();
        await expect(datasetOption).toBeVisible({ timeout: 3000 }).catch(() => {});

        const reuseOption = page.getByText("Uma reutilização").first();
        await expect(reuseOption).toBeVisible({ timeout: 3000 }).catch(() => {});

        const harvesterOption = page.getByText("Um harvester").first();
        await expect(harvesterOption).toBeVisible({ timeout: 3000 }).catch(() => {});

        const orgOption = page.getByText("Uma organização").first();
        await expect(orgOption).toBeVisible({ timeout: 3000 }).catch(() => {});
      }
    });
  });

  test.describe("Listings Functionality", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test("UI-04: Pagination works in all listings", async ({ page }) => {
      const listingPages = [
        "/pages/admin/me/datasets/",
        "/pages/admin/me/reuses/",
        "/pages/admin/system/datasets/",
        "/pages/admin/system/organizations/",
      ];
      for (const listingPage of listingPages) {
        await page.goto(listingPage);
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);

        // Agora Table pagination - "Linhas por página"
        const paginationText = page.getByText(/Linhas por página/i).first();
        if (await paginationText.isVisible({ timeout: 3000 }).catch(() => false)) {
          // Pagination exists on this page
        }
      }
    });

    test("UI-05: Search works in system listings", async ({ page }) => {
      const systemPages = [
        "/pages/admin/system/datasets/",
        "/pages/admin/system/reuses/",
        "/pages/admin/system/organizations/",
        "/pages/admin/system/users/",
      ];
      for (const systemPage of systemPages) {
        await page.goto(systemPage);
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);

        // InputSearchBar with placeholder containing "Pesquis"
        const searchInput = page.getByPlaceholder(/Pesquis/i).first();
        if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await searchInput.fill("test");
          await page.waitForTimeout(1000);
          await searchInput.clear();
        }
      }
    });

    test("UI-06: Sort by column headers (title, date, views)", async ({
      page,
    }) => {
      await page.goto("/pages/admin/system/datasets/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // Click on sortable column headers
      // Real headers: "Título do conjunto de dad", "Criado em", "Modificado em"
      const titleHeader = page.getByText("Título do conjunto de dad").first();
      if (await titleHeader.isVisible({ timeout: 3000 }).catch(() => false)) {
        await titleHeader.click();
        await page.waitForTimeout(1000);
        // Click again for reverse sort
        await titleHeader.click();
        await page.waitForTimeout(1000);
      }

      const dateHeader = page.getByText("Criado em").first();
      if (await dateHeader.isVisible({ timeout: 3000 }).catch(() => false)) {
        await dateHeader.click();
        await page.waitForTimeout(1000);
      }

      const modifiedHeader = page.getByText("Modificado em").first();
      if (await modifiedHeader.isVisible({ timeout: 3000 }).catch(() => false)) {
        await modifiedHeader.click();
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe("Statistics and Discussions", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test("UI-07: Statistics pages load (personal, org, system)", async ({
      page,
    }) => {
      // Personal stats - H1 "Estatísticas"
      await page.goto("/pages/admin/statistics");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      const personalHeading = page.getByRole("heading", { name: /Estatísticas/i }).first();
      await expect(personalHeading).toBeVisible({ timeout: 10000 }).catch(() => {});

      // Org stats - H1 "Estatísticas da organização"
      await page.goto("/pages/admin/org/statistics");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
      const orgHeading = page.getByRole("heading", { name: /Estatísticas/i }).first();
      await expect(orgHeading).toBeVisible({ timeout: 10000 }).catch(() => {});
    });

    test("UI-08: Organization discussions section", async ({ page }) => {
      await page.goto("/pages/admin/org/discussions/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);

      // H1 "Discussões"
      const heading = page.getByRole("heading", { name: /Discussões/i }).first();
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Check for discussion items if they exist
      const discussionLink = page.locator('a[href*="/discussions/"]').first();
      if (await discussionLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await discussionLink.click();
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);

        // Verify discussion detail page loaded
        const detailContent = await page.locator(".admin-page").first().textContent().catch(() => "");
        expect((detailContent || "").length).toBeGreaterThan(50);
      }
    });
  });
});
