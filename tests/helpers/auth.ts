import { Page } from "playwright/test";

async function performLogin(page: Page, email: string, password: string) {
  await page.goto("/pages/login");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);

  // Click "Iniciar sessão" tab
  const sessionTab = page.getByText("Iniciar sessão", { exact: false }).first();
  await sessionTab.scrollIntoViewIfNeeded();
  await sessionTab.click();
  await page.waitForTimeout(1000);

  // Fill email
  const emailInput = page.locator("#login-email:visible");
  await emailInput.scrollIntoViewIfNeeded();
  await emailInput.fill(email);

  // Fill password
  const passwordInput = page.locator("#login-password:visible");
  await passwordInput.scrollIntoViewIfNeeded();
  await passwordInput.fill(password);

  // Submit and wait for navigation (login does window.location.href = redirect)
  const submitBtn = page.locator("form:visible button[type='submit']");
  await submitBtn.scrollIntoViewIfNeeded();
  await submitBtn.click();

  // The form submits via fetch, then does window.location.href = "/" on success.
  // Wait for the page to fully navigate away from /login.
  await page.waitForURL(
    (url) => !url.pathname.includes("/login"),
    { timeout: 30000, waitUntil: "networkidle" },
  );
}

export async function loginAsAdmin(page: Page) {
  await performLogin(
    page,
    process.env.TEST_ADMIN_EMAIL || "e2e-admin@dados.gov.pt",
    process.env.TEST_ADMIN_PASSWORD || "E2eAdmin2026!",
  );
}

export async function loginAsEditor(page: Page) {
  await performLogin(
    page,
    process.env.TEST_EDITOR_EMAIL || "e2e-editor@dados.gov.pt",
    process.env.TEST_EDITOR_PASSWORD || "E2eEditor2026!",
  );
}
