import { test, expect } from '@playwright/test';

// Loads demo profile and waits for the first career row to be visible
async function loadDemo(page: Parameters<Parameters<typeof test>[1]>[0]) {
  await page.goto('/');
  await page
    .getByRole('button', { name: /ver demo/i })
    .first()
    .click();
  await page.waitForURL('**/resultados', { timeout: 15_000 });
  // Wait directly for the career list — avoids networkidle issues with Vite HMR websockets
  await page.locator('.match-row').first().waitFor({ state: 'visible', timeout: 25_000 });
}

test.describe('Navigation', () => {
  test('/resultados shows career list with at least 5 items', async ({ page }) => {
    await loadDemo(page);
    const rows = page.locator('.match-row');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThanOrEqual(5);
  });

  test('clicking a career row opens /detalle/:slug', async ({ page }) => {
    await loadDemo(page);
    await page.locator('.match-row').first().click();
    await page.waitForURL('**/detalle/**', { timeout: 15_000 });
    expect(page.url()).toContain('/detalle/');
  });

  test('"Volver a resultados" goes back to /resultados', async ({ page }) => {
    await loadDemo(page);
    await page.locator('.match-row').first().click();
    await page.waitForURL('**/detalle/**', { timeout: 15_000 });
    await page.getByRole('button', { name: /volver a resultados/i }).click();
    await page.waitForURL('**/resultados');
    expect(page.url()).toContain('/resultados');
  });

  test('unknown route shows 404 page', async ({ page }) => {
    await page.goto('/esta-ruta-no-existe-aqui');
    await expect(page.getByRole('heading', { name: /página no encontrada/i })).toBeVisible({
      timeout: 5_000,
    });
  });

  test('direct URL /resultados works without prior navigation', async ({ page }) => {
    await page.goto('/resultados');
    await expect(page.locator('.dash, .state-center')).toBeVisible({ timeout: 10_000 });
  });

  test('filter chips update the visible list', async ({ page }) => {
    await loadDemo(page);
    await page.getByRole('button', { name: /universitarias/i }).click();
    await expect(page.locator('.match-row, .match-card').first()).toBeVisible({ timeout: 8_000 });
  });

  test('view toggle switches to cards view', async ({ page }) => {
    await loadDemo(page);
    // Open the TweaksPanel FAB then click "Tarjetas"
    await page.locator('button[title="Personalizar apariencia"]').click();
    await page.getByRole('button', { name: /tarjetas/i }).click();
    await expect(page.locator('.match-card').first()).toBeVisible({ timeout: 5_000 });
  });
});
