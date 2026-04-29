import { describe, it, expect } from 'vitest';
import { scoreCarrera } from '../utils/scoring';
import { DEFAULT_PERFIL } from '../data/constants';
import type { Carrera, Perfil } from '../types';

// ---- Fixtures ----

/** High-demand, high-empleabilidad career — matches fullMatchPerfil on all axes */
const baseCarrera: Carrera = {
  _id: 'ing-sistemas',
  slug: 'ing-sistemas',
  nombre: 'Ingeniería de Sistemas',
  tipo: 'Universitaria',
  duracion: '10 semestres',
  categoria: 'Ingeniería y afines',
  ematch: ['I', 'R', 'C'],
  intereses: ['tech', 'ingenieria'],
  resumen: 'Diseño y desarrollo de software.',
  salarioEntrada: 2_800_000,
  salarioMedio: 5_500_000,
  salarioAlto: 9_000_000,
  empleabilidad: 88,
  demanda: 'Alta',
  costoSemestre: 3_500_000,
  becasICETEX: true,
  regionesDemanda: ['andina'],
  demandaPorRegion: { andina: 88, caribe: 72, pacifico: 58, orinoquia: 40, amazonia: 30, insular: 28 },
  universidades: [],
  stayVsLeave: { stay: '...', leave: '...' },
  proyeccion2030: 'Alta',
  acreditadaAltaCalidad: true,
  tasaEmpleabilidad12m: 93,
  habilidadesRequeridas: ['Pensamiento lógico', 'Análisis de datos', 'Creatividad'],
  tags: ['software', 'datos'],
};

/**
 * Weak career: low demand, borderline empleabilidad, not accredited.
 * ematch/intereses have ZERO overlap with fullMatchPerfil — good for isolating
 * individual scoring signals without hitting the cap.
 */
const weakCarrera: Carrera = {
  _id: 'humanidades',
  slug: 'humanidades',
  nombre: 'Humanidades',
  tipo: 'Universitaria',
  duracion: '8 semestres',
  categoria: 'Ciencias sociales y humanas',
  ematch: ['S', 'E'],
  intereses: ['social', 'educacion', 'justicia'],
  resumen: 'Estudio de las ciencias humanas.',
  salarioEntrada: 1_500_000,
  salarioMedio: 2_800_000,
  salarioAlto: 4_600_000,
  empleabilidad: 65,
  demanda: 'Baja',
  costoSemestre: 2_000_000,
  becasICETEX: false,
  regionesDemanda: [],
  demandaPorRegion: { andina: 50, caribe: 50, pacifico: 50, orinoquia: 50, amazonia: 50, insular: 50 },
  universidades: [],
  stayVsLeave: { stay: '...', leave: '...' },
  proyeccion2030: 'Media',
  acreditadaAltaCalidad: false,
  tasaEmpleabilidad12m: 64,
  habilidadesRequeridas: ['Empatía', 'Comunicación', 'Trabajo en equipo'],
  tags: ['social', 'historia'],
};

/** Perfect match for baseCarrera */
const fullMatchPerfil: Perfil = {
  ciudad: 'Bogotá',
  regionId: 'andina',
  estrato: 3,
  grado: 'Grado 11',
  colegioTipo: 'Privado',
  promedio: 4.6,
  saber: '350-399',
  presupuesto: 5_000_000,
  icetex: 'Sí, claro',
  trabajar: 'No, solo estudiar',
  materias: ['Matemáticas', 'Física', 'Tecnología e informática'],
  intereses: ['tech', 'ingenieria'],
  riasec: ['I', 'R', 'C'],
  habilidades: ['Pensamiento lógico', 'Análisis de datos', 'Creatividad'],
  mudarse: 50,
  regionesDisponibles: [],
  modalidad: 'presencial',
  internacional: 'No por ahora',
  completed: true,
};

/** Mismatch profile: no interest/RIASEC/habilidades overlap with baseCarrera */
const noMatchPerfil: Perfil = {
  ...fullMatchPerfil,
  intereses: ['arte', 'social'],
  riasec: ['S', 'E'],
  habilidades: ['Empatía', 'Comunicación'],
  materias: ['Arte y música', 'Inglés'],
  promedio: 3.5,
};

// ---- Tests ----

describe('scoreCarrera', () => {
  it('perfect-match profile against matching career scores >= 80', () => {
    expect(scoreCarrera(baseCarrera, fullMatchPerfil)).toBeGreaterThanOrEqual(80);
  });

  it('score is always clamped to [35, 98]', () => {
    const s = scoreCarrera(baseCarrera, fullMatchPerfil);
    expect(s).toBeGreaterThanOrEqual(35);
    expect(s).toBeLessThanOrEqual(98);
  });

  it('DEFAULT_PERFIL always produces a score in [35, 98]', () => {
    // Use weakCarrera for a mid-range score, not capped
    const s = scoreCarrera(weakCarrera, { ...DEFAULT_PERFIL, completed: true } as Perfil);
    expect(s).toBeGreaterThanOrEqual(35);
    expect(s).toBeLessThanOrEqual(98);
  });

  it('unaffordable career scores lower than affordable one (using noMatchPerfil to avoid cap)', () => {
    const affordable = { ...weakCarrera, costoSemestre: 500_000 };
    const expensive  = { ...weakCarrera, costoSemestre: 20_000_000 };
    // noMatchPerfil presupuesto = 5M inherited; 20M > 10M triggers -15 penalty
    expect(scoreCarrera(affordable, noMatchPerfil)).toBeGreaterThan(scoreCarrera(expensive, noMatchPerfil));
  });

  it('no-migration profile scores high-local-demand career above low-local-demand', () => {
    const highLocal = { ...weakCarrera, demandaPorRegion: { andina: 95, caribe: 50, pacifico: 50, orinoquia: 50, amazonia: 50, insular: 50 } };
    const lowLocal  = { ...weakCarrera, demandaPorRegion: { andina: 15, caribe: 50, pacifico: 50, orinoquia: 50, amazonia: 50, insular: 50 } };
    const noMove: Perfil = { ...noMatchPerfil, regionId: 'andina', regionesDisponibles: [] };

    expect(scoreCarrera(highLocal, noMove)).toBeGreaterThan(scoreCarrera(lowLocal, noMove));
  });

  it('regionesDisponibles expands demand search to best available region', () => {
    const highCaribe = { ...weakCarrera, demandaPorRegion: { andina: 30, caribe: 95, pacifico: 30, orinoquia: 30, amazonia: 30, insular: 30 } };
    const noMove:   Perfil = { ...noMatchPerfil, regionId: 'andina', regionesDisponibles: [] };
    const withMove: Perfil = { ...noMatchPerfil, regionId: 'andina', regionesDisponibles: ['caribe'] };

    expect(scoreCarrera(highCaribe, withMove)).toBeGreaterThan(scoreCarrera(highCaribe, noMove));
  });

  it('SENA/tech career scores higher for students who need to work from the start', () => {
    const senaCarrera: Carrera = { ...weakCarrera, tipo: 'Tecnológica (SENA)' };
    const trabajarPerfil: Perfil = { ...noMatchPerfil, trabajar: 'Sí, desde el inicio' };
    const noTrabajoPerfil: Perfil = { ...noMatchPerfil, trabajar: 'No, solo estudiar' };

    expect(scoreCarrera(senaCarrera, trabajarPerfil)).toBeGreaterThan(scoreCarrera(senaCarrera, noTrabajoPerfil));
  });

  it('high-achiever bonus applies at promedio >= 4.5 with empleabilidad >= 85', () => {
    const top: Perfil   = { ...noMatchPerfil, promedio: 4.6 };
    const lower: Perfil = { ...noMatchPerfil, promedio: 3.5 };
    // baseCarrera.empleabilidad=88 triggers the achiever bonus for 4.5+
    expect(scoreCarrera(baseCarrera, top)).toBeGreaterThan(scoreCarrera(baseCarrera, lower));
  });

  it('accredited career scores higher than equivalent non-accredited career', () => {
    const accred    = { ...weakCarrera, acreditadaAltaCalidad: true };
    const nonAccred = { ...weakCarrera, acreditadaAltaCalidad: false };
    expect(scoreCarrera(accred, noMatchPerfil)).toBeGreaterThan(scoreCarrera(nonAccred, noMatchPerfil));
  });
});
