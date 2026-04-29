import { test, expect } from '@playwright/test';

test.describe('Demo flow', () => {
  test('clicking "Ver demo" on landing navigates to /resultados with results', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('button', { name: /ver demo/i })
      .first()
      .click();
    await page.waitForURL('**/resultados');
    await page.waitForLoadState('networkidle', { timeout: 25_000 });
    await expect(page.locator('.match-row, .match-card').first()).toBeVisible({ timeout: 5_000 });
  });
});

test.describe('Onboarding — step navigation', () => {
  test('all 8 steps can be clicked through and land on /resultados', async ({ page }) => {
    await page.goto('/perfil');

    // Verify step 1: use heading role to avoid strict-mode violation (text appears twice: sidebar + card)
    await expect(page.getByRole('heading', { name: /de dónde escribes/i })).toBeVisible();

    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /siguiente/i }).click();
    }

    await expect(page.getByRole('button', { name: /ver mis resultados/i })).toBeVisible();
    await page.getByRole('button', { name: /ver mis resultados/i }).click();

    await page.waitForURL('**/resultados', { timeout: 15_000 });
    expect(page.url()).toContain('/resultados');
  });

  test('back button returns to previous step', async ({ page }) => {
    await page.goto('/perfil');

    await page.getByRole('button', { name: /siguiente/i }).click();
    await expect(page.getByRole('heading', { name: /cuéntanos sobre tu colegio/i })).toBeVisible();

    await page.getByRole('button', { name: /atrás/i }).click();
    await expect(page.getByRole('heading', { name: /de dónde escribes/i })).toBeVisible();
  });

  test('"Atrás" is disabled on step 1', async ({ page }) => {
    await page.goto('/perfil');
    await expect(page.getByRole('button', { name: /atrás/i })).toBeDisabled();
  });
});
