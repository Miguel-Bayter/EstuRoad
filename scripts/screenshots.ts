/**
 * Capture portfolio screenshots at 1440px viewport.
 * Usage: npx tsx scripts/screenshots.ts
 * Requires: dev server running on http://localhost:5173
 */
import { chromium, type Page } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'screenshots');
const BASE = 'http://localhost:5173';

const DEMO_PROFILE = {
  ciudad: 'Medellín',
  regionId: 'andina',
  estrato: 3,
  grado: 'Grado 11',
  colegioTipo: 'Público',
  promedio: 4.1,
  saber: 'No lo he presentado',
  presupuesto: 2000000,
  icetex: 'Sí, lo consideraría',
  trabajar: 'no',
  materias: ['Matemáticas', 'Tecnología e informática'],
  intereses: ['Tecnología', 'Negocios', 'Diseño'],
  riasec: ['I', 'E', 'R'],
  habilidades: ['Resolución de problemas', 'Trabajo en equipo', 'Comunicación'],
  mudarse: 50,
  regionesDisponibles: ['andina', 'caribe'],
  modalidad: 'presencial',
  internacional: 'Solo si hay beca',
  completed: true,
};

async function shot(page: Page, name: string) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
  console.log(`✓  ${name}.png`);
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Inject demo profile into localStorage before navigating
  await page.addInitScript((profile: object) => {
    localStorage.setItem('er.profile', JSON.stringify(profile));
  }, DEMO_PROFILE);

  // 1. Landing
  await page.goto(BASE);
  await page.waitForLoadState('domcontentloaded');
  await shot(page, '01-landing');

  // 2. Onboarding step 1
  await page.goto(`${BASE}/perfil`);
  await page.waitForLoadState('domcontentloaded');
  await shot(page, '02-onboarding-step1');

  // Navigate to RIASEC step (step 5)
  for (let i = 0; i < 4; i++) {
    await page.getByRole('button', { name: /siguiente/i }).click();
    await page.waitForTimeout(300);
  }
  await shot(page, '03-onboarding-riasec');

  // 3. Results — list view
  await page.goto(`${BASE}/resultados`);
  await page.locator('.match-row').first().waitFor({ state: 'visible', timeout: 20_000 });
  await shot(page, '04-results-list');

  // 4. Results — cards view (open TweaksPanel)
  await page.locator('button[title="Personalizar apariencia"]').click();
  await page.getByRole('button', { name: /tarjetas/i }).click();
  await page.locator('.match-card').first().waitFor({ state: 'visible', timeout: 5_000 });
  await page.locator('button[title="Personalizar apariencia"]').click(); // close
  await shot(page, '05-results-cards');

  // 5. Detail page — wait for hero content to be fully rendered
  await page.locator('.match-card').first().click();
  await page.waitForURL('**/detalle/**', { timeout: 10_000 });
  await page.locator('.detail-hero').waitFor({ state: 'visible', timeout: 15_000 });
  await shot(page, '06-detail');

  // 6. Compare — wait for compare table (auto-populates with top 3)
  await page.goto(`${BASE}/comparar`);
  await page.locator('.compare').waitFor({ state: 'visible', timeout: 20_000 });
  await shot(page, '07-compare');

  // 7. Map full — wait for SVG map to render
  await page.goto(`${BASE}/mapa`);
  await page.locator('svg').first().waitFor({ state: 'visible', timeout: 15_000 });
  await shot(page, '08-map');

  await browser.close();
  console.log('\nScreenshots saved to public/screenshots/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
