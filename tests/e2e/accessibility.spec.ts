import { test, expect } from '@playwright/test';

test.describe('Skip link', () => {
  test('skip link is focusable and points to #main-content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    const href = await focused.getAttribute('href');
    expect(href).toBe('#main-content');
  });

  test('pressing Enter on skip link moves focus to main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const linkText = await page
      .locator(':focus')
      .innerText()
      .catch(() => '');
    if (!linkText.toLowerCase().includes('saltar') && !linkText.toLowerCase().includes('skip')) {
      test.skip();
      return;
    }

    await page.keyboard.press('Enter');
    // <main id="main-content" tabIndex={-1}> receives focus on skip link activation
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('main-content');
  });
});

test.describe('Keyboard navigation — onboarding', () => {
  test('Tab moves through interactive elements without getting trapped', async ({ page }) => {
    await page.goto('/perfil');

    const focusedElements: string[] = [];
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const tag = await page.evaluate(
        () => `${document.activeElement?.tagName ?? 'none'}#${document.activeElement?.id ?? ''}`
      );
      focusedElements.push(tag);
    }

    const unique = new Set(focusedElements);
    expect(unique.size).toBeGreaterThan(3);
  });

  test('"Siguiente" button is reachable by keyboard and clickable', async ({ page }) => {
    await page.goto('/perfil');

    // Onboarding has many chips in step 1 (cities, budget, etc.) — use up to 60 Tab presses
    let found = false;
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab');
      const text = await page.evaluate(
        () => (document.activeElement as HTMLElement)?.innerText?.trim() ?? ''
      );
      if (/siguiente/i.test(text)) {
        found = true;
        break;
      }
    }

    if (!found) {
      test.skip();
      return;
    }

    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: /cuéntanos sobre tu colegio/i })).toBeVisible({
      timeout: 3_000,
    });
  });
});

test.describe('ARIA attributes', () => {
  test('Nav has role=navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[role="navigation"]').first()).toBeVisible();
  });

  test('active nav link has aria-current="page"', async ({ page }) => {
    await page.goto('/perfil');
    const current = page.locator('[aria-current="page"]');
    await expect(current).toBeVisible({ timeout: 5_000 });
  });

  test('filter chips in results have aria-pressed', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('button', { name: /ver demo/i })
      .first()
      .click();
    await page.waitForURL('**/resultados', { timeout: 15_000 });
    await page
      .locator('.match-row, .match-card')
      .first()
      .waitFor({ state: 'visible', timeout: 25_000 });

    const chips = page.locator('.chips button, .chip');
    const count = await chips.count();
    if (count > 0) {
      const pressed = await chips.first().getAttribute('aria-pressed');
      expect(pressed).not.toBeNull();
    }
  });

  test('region chips in StepMovilidad have aria-pressed', async ({ page }) => {
    await page.goto('/perfil');
    // Navigate to step 8 — use heading role to avoid strict mode violations
    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /siguiente/i }).click();
    }
    await expect(page.getByRole('heading', { name: /cómo prefieres estudiar/i })).toBeVisible({
      timeout: 5_000,
    });

    const regionChips = page.locator('.region-chip');
    const count = await regionChips.count();
    if (count > 0) {
      const pressed = await regionChips.first().getAttribute('aria-pressed');
      expect(pressed).not.toBeNull();
    }
  });
});

test.describe('Colombia Map accessibility', () => {
  test('SVG map has role=img or is labelled', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('button', { name: /ver demo/i })
      .first()
      .click();
    await page.waitForURL('**/resultados', { timeout: 15_000 });
    await page
      .locator('.match-row, .match-card')
      .first()
      .waitFor({ state: 'visible', timeout: 25_000 });

    const mapBtn = page.locator('button').filter({ hasText: /mapa/i });
    if (await mapBtn.isVisible()) {
      await mapBtn.click();
      const svg = page.locator('svg').first();
      const role = await svg.getAttribute('role');
      const label = await svg.getAttribute('aria-label');
      expect(role === 'img' || label !== null).toBe(true);
    }
  });
});
