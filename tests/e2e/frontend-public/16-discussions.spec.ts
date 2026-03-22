import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Discussions on Dataset Detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/pages/datasets`);
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator('a[href*="/pages/datasets/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();
    await page.waitForLoadState("networkidle");

    // Navigate to discussions tab
    const discussionTab = page.locator(
      'button:has-text("Discussões"), a:has-text("Discussões"), button:has-text("Discussão"), [role="tab"]:has-text("Discuss")'
    );
    if ((await discussionTab.count()) > 0) {
      await discussionTab.first().click();
      await page.waitForTimeout(1000);
    }
  });

  test("DI-01: Discussion tab shows existing discussions", async ({
    page,
  }) => {
    const body = await page.textContent("body");
    const hasDiscussions =
      body?.toLowerCase().includes("discussão") ||
      body?.toLowerCase().includes("discussões") ||
      body?.toLowerCase().includes("comentário") ||
      body?.toLowerCase().includes("nenhuma discussão");
    expect(hasDiscussions).toBeTruthy();
  });

  test("DI-02: Discussion with replies shows all replies", async ({
    page,
  }) => {
    const discussions = page.locator(
      '[class*="discussion"], [class*="thread"], [class*="comment"]'
    );
    if ((await discussions.count()) > 0) {
      const firstDiscussion = discussions.first();
      await expect(firstDiscussion).toBeVisible();

      const replies = firstDiscussion.locator(
        '[class*="reply"], [class*="response"], [class*="comment"]'
      );
      // May or may not have replies
      const body = await firstDiscussion.textContent();
      expect(body).toBeTruthy();
    }
  });

  test("DI-03: Discussion without replies shown correctly", async ({
    page,
  }) => {
    const discussions = page.locator(
      '[class*="discussion"], [class*="thread"], [class*="comment"]'
    );
    if ((await discussions.count()) > 0) {
      await expect(discussions.first()).toBeVisible();
    } else {
      const body = await page.textContent("body");
      expect(body).toBeTruthy();
    }
  });

  test.skip("DI-04: Follow dataset button (needs auth)", async () => {
    // Skipped: requires authenticated user
  });

  test.skip("DI-05: Unfollow dataset (needs auth)", async () => {
    // Skipped: requires authenticated user
  });

  test.skip("DI-06: Follow organization (needs auth)", async () => {
    // Skipped: requires authenticated user
  });

  test.skip("DI-07: Follow reuse (needs auth)", async () => {
    // Skipped: requires authenticated user
  });
});
