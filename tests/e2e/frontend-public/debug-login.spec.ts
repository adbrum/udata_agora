import { test, expect } from "playwright/test";

test("login flow returns proper response (not 500)", async ({ page }) => {
  const loginResponsePromise = page.waitForResponse(
    (res) => res.url().includes("/login") && res.request().method() === "POST",
    { timeout: 15000 }
  );

  await page.goto("http://localhost:3000/pages/login");
  await page.waitForTimeout(2000);

  await page.getByRole("tab", { name: "Iniciar sessão" }).click();
  await page.waitForTimeout(1000);

  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "testpassword");
  await page.click('button[type="submit"]');

  const loginResponse = await loginResponsePromise;

  console.log(`\n=== LOGIN RESULT ===`);
  console.log(`Status: ${loginResponse.status()}`);
  console.log(`===================\n`);

  // Must NOT be 500
  expect(loginResponse.status()).not.toBe(500);
  // Should be 200 (login success) or 400 (invalid credentials)
  expect([200, 400]).toContain(loginResponse.status());
});
