import { describe, it, expect } from 'vitest';
import { adaptCarrera, type ApiCarrera } from '../api/adapters';

// ---- Fixture ----

const base: ApiCarrera = {
  slug: 'ing-sistemas',
  nombre: 'Ingeniería de Sistemas',
  descripcion: 'Diseño y desarrollo de software.',
  categoria: 'Ingeniería y afines',
  tipo: 'universidad',
  duracionSemestres: 10,
  costoSemestre: 4_000_000,
  salarioEntrada: 2_800_000,
  salarioMedio: 5_500_000,
  salarioMediana: 5_000_000,
  empleabilidad: 88,
  tasaEmpleabilidad12m: 91,
  demandaPorRegion: {
    Bogotá: 90,
    Antioquia: 85,
    'Valle del Cauca': 70,
    Atlántico: 65,
    Santander: 68,
    Cundinamarca: 80,
  },
  universidades: ['Universidad Nacional de Colombia', 'Universidad EAFIT'],
  habilidadesRequeridas: ['Pensamiento lógico', 'Análisis de datos'],
  tags: ['software', 'datos', 'ia'],
  proyeccion2030: 'Alta. El sector tecnológico seguirá creciendo.',
  acreditadaAltaCalidad: true,
  ultimaActualizacion: '2026-01-01',
  cineCode: '0613',
};

// ---- Tests ----

describe('adaptCarrera', () => {
  it('produces all required Carrera fields', () => {
    const c = adaptCarrera(base);
    expect(c.slug).toBe('ing-sistemas');
    expect(c.nombre).toBeTruthy();
    expect(c.tipo).toBeTruthy();
    expect(c.categoria).toBeTruthy();
    expect(Array.isArray(c.ematch)).toBe(true);
    expect(Array.isArray(c.intereses)).toBe(true);
    expect(Array.isArray(c.universidades)).toBe(true);
    expect(typeof c.demandaPorRegion).toBe('object');
    expect(typeof c.stayVsLeave).toBe('object');
  });

  it('capitalizes tipo "universidad" → Universitaria', () => {
    expect(adaptCarrera({ ...base, tipo: 'universidad privada' }).tipo).toBe('Universitaria');
  });

  it('capitalizes tipo SENA → Tecnológica (SENA)', () => {
    expect(adaptCarrera({ ...base, tipo: 'tecnologica sena' }).tipo).toBe('Tecnológica (SENA)');
  });

  it('capitalizes tipo tecnologica (non-SENA) → Tecnológica', () => {
    expect(adaptCarrera({ ...base, tipo: 'tecnologica' }).tipo).toBe('Tecnológica');
  });

  it('swaps salarioMedio and salarioEntrada when inverted', () => {
    const inverted = { ...base, salarioMedio: 1_000_000, salarioEntrada: 6_000_000 };
    const c = adaptCarrera(inverted);
    expect(c.salarioMedio).toBeGreaterThan(c.salarioEntrada);
  });

  it('inverted salarios produce no NaN', () => {
    const inverted = { ...base, salarioMedio: 1_000_000, salarioEntrada: 6_000_000 };
    const c = adaptCarrera(inverted);
    expect(isNaN(c.salarioMedio)).toBe(false);
    expect(isNaN(c.salarioEntrada)).toBe(false);
    expect(isNaN(c.salarioAlto)).toBe(false);
  });

  it('clamps empleabilidad > 100 to 100', () => {
    const c = adaptCarrera({ ...base, empleabilidad: 150 });
    expect(c.empleabilidad).toBe(100);
  });

  it('clamps empleabilidad < 0 to 0', () => {
    const c = adaptCarrera({ ...base, empleabilidad: -10 });
    expect(c.empleabilidad).toBe(0);
  });

  it('defaults universidades to [] when undefined', () => {
    const c = adaptCarrera({ ...base, universidades: undefined as unknown as string[] });
    expect(c.universidades).toEqual([]);
  });

  it('defaults habilidadesRequeridas to [] when undefined', () => {
    const c = adaptCarrera({ ...base, habilidadesRequeridas: undefined as unknown as string[] });
    expect(c.habilidadesRequeridas).toEqual([]);
  });

  it('maps demandaPorRegion to 6 macroregiones', () => {
    const c = adaptCarrera(base);
    const keys = Object.keys(c.demandaPorRegion);
    expect(keys).toContain('andina');
    expect(keys).toContain('caribe');
    expect(keys).toContain('pacifico');
    expect(keys).toContain('orinoquia');
    expect(keys).toContain('amazonia');
    expect(keys).toContain('insular');
  });

  it('all macroregion demand values are in [0, 100]', () => {
    const c = adaptCarrera(base);
    for (const v of Object.values(c.demandaPorRegion)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });

  it('salarioAlto is greater than salarioMedio', () => {
    const c = adaptCarrera(base);
    expect(c.salarioAlto).toBeGreaterThan(c.salarioMedio);
  });
});
