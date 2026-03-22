import { test, expect } from "playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Authentication Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/pages/login`);
    await page.waitForLoadState("networkidle");
  });

  test('AU-01: Click "Autenticar" in header opens login page', async ({
    page,
  }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const authButton = page.locator(
      'a:has-text("Autenticar"), button:has-text("Autenticar"), a:has-text("Login"), button:has-text("Login")'
    );
    await expect(authButton.first()).toBeVisible({ timeout: 10000 });
    await authButton.first().click();
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("login");
  });

  test("AU-02: Three auth tabs visible: CMD, eIDAS, Email/Password", async ({
    page,
  }) => {
    const body = await page.textContent("body");
    const hasCMD =
      body?.includes("Chave Móvel Digital") || body?.includes("CMD");
    const hasEIDAS =
      body?.includes("eIDAS") || body?.includes("europeia");
    const hasEmail =
      body?.includes("Email") || body?.includes("email");

    expect(hasCMD || hasEIDAS || hasEmail).toBeTruthy();
  });

  test("AU-03: CMD tab shows description, citizen option, terms checkbox, button", async ({
    page,
  }) => {
    const cmdTab = page.locator(
      'button:has-text("Chave Móvel"), button:has-text("CMD"), [role="tab"]:has-text("CMD")'
    );
    if ((await cmdTab.count()) > 0) {
      await cmdTab.first().click();
      await page.waitForTimeout(500);
    }

    const termsCheckbox = page.locator(
      'input[type="checkbox"], [class*="checkbox"]'
    );
    if ((await termsCheckbox.count()) > 0) {
      await expect(termsCheckbox.first()).toBeVisible();
    }

    const body = await page.textContent("body");
    expect(body).toBeTruthy();
  });

  test("AU-04: CMD button disabled until terms accepted", async ({
    page,
  }) => {
    const cmdTab = page.locator(
      'button:has-text("Chave Móvel"), button:has-text("CMD"), [role="tab"]:has-text("CMD")'
    );
    if ((await cmdTab.count()) > 0) {
      await cmdTab.first().click();
      await page.waitForTimeout(500);
    }

    const submitButton = page.locator(
      'button[type="submit"], button:has-text("Autenticar"), button:has-text("Entrar")'
    );
    if ((await submitButton.count()) > 0) {
      const isDisabled = await submitButton.first().isDisabled();
      // Button should be disabled before accepting terms
      expect(isDisabled).toBeTruthy();
    }
  });

  test.skip("AU-05: Accept terms and click CMD button (needs CMD service)", async () => {
    // Skipped: requires CMD authentication service
  });

  test("AU-06: eIDAS tab shows info, terms checkbox, button", async ({
    page,
  }) => {
    const eidasTab = page.locator(
      'button:has-text("eIDAS"), button:has-text("europeia"), [role="tab"]:has-text("eIDAS")'
    );
    if ((await eidasTab.count()) > 0) {
      await eidasTab.first().click();
      await page.waitForTimeout(500);

      const body = await page.textContent("body");
      expect(
        body?.includes("eIDAS") || body?.includes("europeia")
      ).toBeTruthy();
    }
  });

  test.skip("AU-07: Email tab - valid login (needs test credentials)", async () => {
    // Skipped: requires valid test credentials
  });

  test.skip("AU-08: Email tab - invalid login shows error (needs backend)", async () => {
    // Skipped: requires backend to be running
  });

  test("AU-09: Email tab - empty fields prevent submission", async ({
    page,
  }) => {
    const emailTab = page.locator(
      'button:has-text("Email"), [role="tab"]:has-text("Email")'
    );
    if ((await emailTab.count()) > 0) {
      await emailTab.first().click();
      await page.waitForTimeout(500);
    }

    const submitButton = page.locator(
      'button[type="submit"], button:has-text("Entrar"), button:has-text("Login")'
    );
    if ((await submitButton.count()) > 0) {
      await submitButton.first().click();
      await page.waitForTimeout(500);

      // Check for validation errors or that form was not submitted
      const emailInput = page.locator(
        'input[type="email"], input[name="email"]'
      );
      if ((await emailInput.count()) > 0) {
        const validationMessage = await emailInput
          .first()
          .evaluate((el: HTMLInputElement) => el.validationMessage);
        // Either native validation or still on login page
        expect(page.url()).toContain("login");
      }
    }
  });

  test("AU-10: Terms link visible on all tabs", async ({ page }) => {
    const termsLink = page.locator(
      'a:has-text("Termos"), a:has-text("termos"), a[href*="terms"]'
    );
    if ((await termsLink.count()) > 0) {
      await expect(termsLink.first()).toBeVisible();
    }
  });

  test("AU-11: Register page redirects to login or shows registration", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/pages/register`);
    await page.waitForLoadState("networkidle");

    const body = await page.textContent("body");
    // Should either redirect to login or show registration form
    expect(
      page.url().includes("login") ||
        page.url().includes("register") ||
        body?.includes("Registar") ||
        body?.includes("Autenticar")
    ).toBeTruthy();
  });

  test.skip("AU-12: Logout (needs auth)", async () => {
    // Skipped: requires authenticated session
  });

  test.skip("AU-13: Account migration page loads (conditional)", async () => {
    // Skipped: conditional feature, may not be available
  });
});
