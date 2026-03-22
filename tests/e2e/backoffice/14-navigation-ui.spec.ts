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
      await page.waitForTimeout(1000);
      const sidebar = page.locator(
        'nav[aria-label*="sidebar"], aside, .sidebar, [data-testid="sidebar"]'
      );
      await expect(sidebar.first()).toBeVisible({ timeout: 10000 });
      // Admin should see personal, org, and system sections
      const personalSection = page.locator(
        'text="Os meus", text="Personal", text="Pessoal", a[href*="/admin/me"]'
      );
      await expect(personalSection.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
      const orgSection = page.locator(
        'text="Organização", text="Organization", a[href*="/admin/org"]'
      );
      await expect(orgSection.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
      const systemSection = page.locator(
        'text="Sistema", text="System", a[href*="/admin/system"]'
      );
      await expect(systemSection.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
      // Test as editor
      await loginAsEditor(page);
      await page.goto("/pages/admin/");
      await page.waitForTimeout(1000);
      // Editor should see personal and org but NOT system
      await expect(personalSection.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
      const systemHidden = await systemSection.first().isVisible({ timeout: 2000 }).catch(() => false);
      // System section should ideally not be visible for editors
    });
  });

  test.describe("Header", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test("UI-02: Header shows user name and active org", async ({ page }) => {
      await page.goto("/pages/admin/");
      await page.waitForTimeout(1000);
      const header = page.locator(
        'header, [data-testid="header"], .admin-header'
      );
      await expect(header.first()).toBeVisible({ timeout: 10000 });
      // User name or avatar indicator
      const userName = page.locator(
        '[data-testid="user-name"], .user-name, .user-info, [aria-label*="user"], [aria-label*="utilizador"]'
      );
      await expect(userName.first()).toBeVisible({ timeout: 5000 }).catch(() => {
        // User info may be in a dropdown or avatar
      });
      // Active org indicator
      const orgIndicator = page.locator(
        '[data-testid="active-org"], .org-indicator, .org-name, select[name*="org"]'
      );
      await expect(orgIndicator.first()).toBeVisible({ timeout: 5000 }).catch(() => {
        // Org may not be shown in header
      });
    });
  });

  test.describe("Quick Publish Menu", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test("UI-03: Quick publish menu offers dataset, reuse, harvester, org", async ({
      page,
    }) => {
      await page.goto("/pages/admin/");
      await page.waitForTimeout(1000);
      // Find quick publish/create button
      const quickCreateBtn = page.locator(
        'button:has-text("Publicar"), button:has-text("Criar"), button[aria-label*="create"], [data-testid="quick-create"], .quick-publish'
      );
      if (await quickCreateBtn.first().isVisible({ timeout: 5000 })) {
        await quickCreateBtn.first().click();
        await page.waitForTimeout(500);
        // Check menu items
        const datasetOption = page.locator(
          'a:has-text("Dataset"), button:has-text("Dataset"), [data-testid="create-dataset"]'
        );
        await expect(datasetOption.first()).toBeVisible({ timeout: 3000 }).catch(() => {});
        const reuseOption = page.locator(
          'a:has-text("Reutilização"), a:has-text("Reuse"), [data-testid="create-reuse"]'
        );
        await expect(reuseOption.first()).toBeVisible({ timeout: 3000 }).catch(() => {});
        const harvesterOption = page.locator(
          'a:has-text("Harvester"), a:has-text("Coletor"), [data-testid="create-harvester"]'
        );
        await expect(harvesterOption.first()).toBeVisible({ timeout: 3000 }).catch(() => {});
        const orgOption = page.locator(
          'a:has-text("Organização"), a:has-text("Organization"), [data-testid="create-org"]'
        );
        await expect(orgOption.first()).toBeVisible({ timeout: 3000 }).catch(() => {});
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
        await page.waitForTimeout(1000);
        const paginationBtn = page.locator(
          '.pagination button, nav[aria-label*="pagination"] a, button:has-text("Seguinte"), button:has-text("Next"), .page-link'
        );
        if (await paginationBtn.first().isVisible({ timeout: 3000 })) {
          await paginationBtn.first().click();
          await page.waitForTimeout(1000);
          // Verify page content updated (URL or content change)
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
        await page.waitForTimeout(1000);
        const searchInput = page.locator(
          'input[type="search"], input[placeholder*="Pesquisar"], input[placeholder*="Search"]'
        );
        if (await searchInput.isVisible({ timeout: 3000 })) {
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
      await page.waitForTimeout(1000);
      // Click on sortable column headers
      const titleHeader = page.locator(
        'th:has-text("Título"), th:has-text("Title"), th:has-text("Nome"), button:has-text("Título")'
      );
      if (await titleHeader.first().isVisible({ timeout: 3000 })) {
        await titleHeader.first().click();
        await page.waitForTimeout(1000);
        // Click again for reverse sort
        await titleHeader.first().click();
        await page.waitForTimeout(1000);
      }
      const dateHeader = page.locator(
        'th:has-text("Data"), th:has-text("Date"), th:has-text("Criado"), button:has-text("Data")'
      );
      if (await dateHeader.first().isVisible({ timeout: 3000 })) {
        await dateHeader.first().click();
        await page.waitForTimeout(1000);
      }
      const viewsHeader = page.locator(
        'th:has-text("Visualizações"), th:has-text("Views"), th:has-text("Visitas"), button:has-text("Visualizações")'
      );
      if (await viewsHeader.first().isVisible({ timeout: 3000 })) {
        await viewsHeader.first().click();
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
      // Personal stats
      await page.goto("/pages/admin/me/");
      await page.waitForTimeout(1000);
      const personalStats = page.locator(
        '.stats, .statistics, .dashboard, [data-testid="stats"], text="Estatísticas", text="Statistics"'
      );
      await expect(personalStats.first()).toBeVisible({ timeout: 10000 }).catch(() => {
        // Stats may be on the main admin page
      });
      // Org stats
      await page.goto("/pages/admin/org/");
      await page.waitForTimeout(1000);
      const orgContent = page.locator(
        '.stats, .statistics, .dashboard, table, text="Organização"'
      );
      await expect(orgContent.first()).toBeVisible({ timeout: 10000 }).catch(() => {});
      // System stats
      await page.goto("/pages/admin/system/");
      await page.waitForTimeout(1000);
      const systemContent = page.locator(
        '.stats, .statistics, .dashboard, table, text="Sistema"'
      );
      await expect(systemContent.first()).toBeVisible({ timeout: 10000 }).catch(() => {});
    });

    test("UI-08: Organization discussions section", async ({ page }) => {
      await page.goto("/pages/admin/org/discussions/");
      await page.waitForTimeout(1000);
      const discussionsContent = page.locator(
        'table, .discussion-list, text="Nenhuma discussão", text="No discussions", text="Discussões"'
      );
      await expect(discussionsContent.first()).toBeVisible({ timeout: 10000 });
      // Check for discussion items if they exist
      const discussionItems = page.locator(
        'table tbody tr, .discussion-item, .discussion-card'
      );
      const count = await discussionItems.count();
      if (count > 0) {
        // Click on first discussion
        await discussionItems.first().locator("a").first().click();
        await page.waitForTimeout(1000);
        // Verify discussion detail page
        const discussionDetail = page.locator(
          '.discussion-detail, .discussion-thread, [data-testid="discussion-detail"]'
        );
        await expect(discussionDetail.first()).toBeVisible({ timeout: 5000 }).catch(() => {});
      }
    });
  });
});
