import { test, expect } from "@playwright/test";

/**
 * Smoke tests for every app page.
 * - Public pages must return 200 and render without error.
 * - Protected pages may return 200 (when auth is mocked/set) or 302/307 to sign-in.
 * - No page should return 500.
 */
const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

test.describe("All pages load without server error", () => {
  test("GET / (home) returns 200", async ({ request }) => {
    const res = await request.get(`${BASE}/`);
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("MediQ");
  });

  test("GET /doctors returns 200", async ({ request }) => {
    const res = await request.get(`${BASE}/doctors`);
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("Doctors");
  });

  test("GET /doctors/[id] with invalid id returns 200 (not 500)", async ({ request }) => {
    const res = await request.get(`${BASE}/doctors/non-existent-doctor-id`);
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toMatch(/Doctor not found|Back|doctors/);
  });

  test("GET /me/appointments returns 200 or redirect to sign-in", async ({ request }) => {
    const res = await request.get(`${BASE}/me/appointments`, {
      maxRedirects: 0,
    });
    const status = res.status();
    expect([200, 302, 307]).toContain(status);
    if (status === 302 || status === 307) {
      const location = res.headers()["location"] ?? "";
      expect(location).toMatch(/signin|auth/);
    }
  });

  test("GET /doctor returns 200 or redirect to sign-in", async ({ request }) => {
    const res = await request.get(`${BASE}/doctor`, { maxRedirects: 0 });
    const status = res.status();
    expect([200, 302, 307]).toContain(status);
    if (status === 302 || status === 307) {
      const location = res.headers()["location"] ?? "";
      expect(location).toMatch(/signin|auth/);
    }
  });

  test("GET /doctor/dashboard returns 200 or redirect to sign-in", async ({ request }) => {
    const res = await request.get(`${BASE}/doctor/dashboard`, { maxRedirects: 0 });
    const status = res.status();
    expect([200, 302, 307]).toContain(status);
    if (status === 302 || status === 307) {
      const location = res.headers()["location"] ?? "";
      expect(location).toMatch(/signin|auth/);
    }
  });

  test("GET /doctor/[id] returns 200 or redirect to sign-in", async ({ request }) => {
    const res = await request.get(`${BASE}/doctor/some-id`, { maxRedirects: 0 });
    const status = res.status();
    expect([200, 302, 307]).toContain(status);
  });

  test("GET /admin returns 200 or redirect to sign-in", async ({ request }) => {
    const res = await request.get(`${BASE}/admin`, { maxRedirects: 0 });
    const status = res.status();
    expect([200, 302, 307]).toContain(status);
    if (status === 302 || status === 307) {
      const location = res.headers()["location"] ?? "";
      expect(location).toMatch(/signin|auth/);
    }
  });

  test("GET /admin/slots returns 200 or redirect to sign-in", async ({ request }) => {
    const res = await request.get(`${BASE}/admin/slots`, { maxRedirects: 0 });
    const status = res.status();
    expect([200, 302, 307]).toContain(status);
  });
});

test.describe("Browser: public pages render without client error", () => {
  test("Home page has MediQ and Browse Doctors", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /MediQ/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse Doctors" })).toBeVisible();
  });

  test("Doctors list page loads", async ({ page }) => {
    await page.goto("/doctors");
    await expect(page.getByRole("heading", { name: /Doctors/i })).toBeVisible();
  });

  test("Doctor detail with invalid id shows not found", async ({ page }) => {
    await page.goto("/doctors/non-existent-id");
    await expect(page.getByText(/Doctor not found|Back/i)).toBeVisible();
  });
});
