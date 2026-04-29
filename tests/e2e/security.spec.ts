import { test, expect } from '@playwright/test';

test.describe('Frontend security — localStorage', () => {
  test('sessionToken is NOT stored in localStorage after demo load', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('button', { name: /ver demo/i })
      .first()
      .click();
    await page.waitForURL('**/resultados', { timeout: 15_000 });

    const token = await page.evaluate(() => localStorage.getItem('sessionToken'));
    expect(token).toBeNull();
  });

  test('sessionToken is NOT stored in localStorage after onboarding completion', async ({
    page,
  }) => {
    await page.goto('/perfil');

    // Click through all 8 steps without filling fields
    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /siguiente/i }).click();
    }
    await page.getByRole('button', { name: /ver mis resultados/i }).click();
    await page.waitForURL('**/resultados', { timeout: 15_000 });

    const token = await page.evaluate(() => localStorage.getItem('sessionToken'));
    expect(token).toBeNull();
  });

  test('profile data in localStorage is JSON (not raw token)', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('button', { name: /ver demo/i })
      .first()
      .click();
    await page.waitForURL('**/resultados', { timeout: 15_000 });

    const raw = await page.evaluate(() => localStorage.getItem('er.profile'));
    if (raw) {
      // Must be parseable JSON, not a raw token string
      expect(() => JSON.parse(raw)).not.toThrow();
      const parsed = JSON.parse(raw) as unknown;
      expect(typeof parsed).toBe('object');
    }
  });
});

test.describe('Backend API validation', () => {
  // These tests hit the Express server (localhost:3001 or proxied /api).
  // They are skipped automatically if the server is not running.

  test('POST /api/perfiles with estrato 7 returns 400', async ({ request }) => {
    let res: Awaited<ReturnType<typeof request.post>>;
    try {
      res = await request.post('http://localhost:3001/api/perfiles', {
        data: {
          ciudad: 'Bogotá',
          estrato: 7,
          presupuesto: 2_000_000,
          intereses: ['tech'],
        },
        timeout: 3_000,
      });
    } catch {
      test.skip();
      return;
    }
    expect(res.status()).toBe(400);
  });

  test('PATCH /api/perfiles/:id without session cookie returns 401', async ({ request }) => {
    let res: Awaited<ReturnType<typeof request.patch>>;
    try {
      res = await request.patch('http://localhost:3001/api/perfiles/test-id-000', {
        data: { ciudad: 'Medellín' },
        timeout: 3_000,
      });
    } catch {
      test.skip();
      return;
    }
    expect([401, 403]).toContain(res.status());
  });
});
