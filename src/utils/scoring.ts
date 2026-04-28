import type { Carrera, Perfil } from '../types';

const MATERIAS_TO_CATEGORIA: Record<string, string[]> = {
  'Matemáticas':              ['Ingeniería y afines', 'Matemáticas y ciencias naturales', 'Economía y administración'],
  'Física':                   ['Ingeniería y afines', 'Matemáticas y ciencias naturales'],
  'Química':                  ['Ciencias de la salud', 'Matemáticas y ciencias naturales', 'Agronomía y veterinaria'],
  'Biología':                 ['Ciencias de la salud', 'Agronomía y veterinaria', 'Matemáticas y ciencias naturales'],
  'Tecnología e informática': ['Ingeniería y afines'],
  'Español':                  ['Ciencias sociales y humanas', 'Ciencias de la educación', 'Bellas artes', 'Derecho y ciencias políticas'],
  'Historia':                 ['Ciencias sociales y humanas', 'Derecho y ciencias políticas', 'Ciencias de la educación'],
  'Geografía':                ['Ciencias sociales y humanas', 'Agronomía y veterinaria'],
  'Sociales':                 ['Ciencias sociales y humanas', 'Derecho y ciencias políticas'],
  'Arte y música':            ['Bellas artes', 'Ciencias de la educación'],
  'Filosofía':                ['Ciencias sociales y humanas', 'Derecho y ciencias políticas', 'Ciencias de la educación'],
  'Inglés':                   ['Ciencias de la educación', 'Ciencias sociales y humanas'],
  'Ciencias naturales':       ['Ciencias de la salud', 'Agronomía y veterinaria', 'Matemáticas y ciencias naturales'],
  'Educación física':         ['Ciencias de la salud'],
};

const CATEGORIA_TO_RIASEC: Record<string, string[]> = {
  'Ingeniería y afines':              ['I', 'R', 'C'],
  'Ciencias de la salud':             ['I', 'S', 'R'],
  'Ciencias sociales y humanas':      ['S', 'A', 'I'],
  'Economía y administración':        ['E', 'C', 'I'],
  'Bellas artes':                     ['A', 'R', 'I'],
  'Derecho y ciencias políticas':     ['E', 'S', 'C'],
  'Ciencias de la educación':         ['S', 'A', 'I'],
  'Matemáticas y ciencias naturales': ['I', 'R', 'C'],
  'Agronomía y veterinaria':          ['R', 'I', 'S'],
};

function materiasBonus(categoria: string, materias: string[]): number {
  const matches = materias.filter((m) => MATERIAS_TO_CATEGORIA[m]?.includes(categoria)).length;
  return Math.min(8, matches * 3);
}

export function scoreCarrera(carrera: Carrera, perfil: Perfil): number {
  let score = 50;

  // Interests match (max +20)
  const matchIntereses = carrera.intereses.filter((i) => perfil.intereses.includes(i)).length;
  score += Math.min(20, matchIntereses * 8);

  // RIASEC match (max +18)
  const matchRiasec = carrera.ematch.filter((r) => perfil.riasec.includes(r)).length;
  score += Math.min(18, matchRiasec * 7);

  // Habilidades match (max +10)
  if (carrera.habilidadesRequeridas?.length) {
    const matchHabil = carrera.habilidadesRequeridas.filter((h) => perfil.habilidades.includes(h)).length;
    score += Math.min(10, matchHabil * 4);
  }

  // School subjects → categoria alignment (max +8)
  score += materiasBonus(carrera.categoria, perfil.materias);

  // Materias → RIASEC cross-signal (max +6): materias imply RIASEC codes via their categorias
  const materiasCats = perfil.materias.flatMap((m) => MATERIAS_TO_CATEGORIA[m] ?? []);
  const materiasRiasec = [...new Set(materiasCats.flatMap((cat) => CATEGORIA_TO_RIASEC[cat] ?? []))];
  const crossMatch = carrera.ematch.filter((r) => materiasRiasec.includes(r)).length;
  score += Math.min(6, crossMatch * 2);

  // Budget viability
  const free = carrera.costoSemestre === 0;
  if (free || carrera.costoSemestre <= perfil.presupuesto) {
    score += 12;
  } else if (carrera.costoSemestre > perfil.presupuesto * 2) {
    score -= 15;
  } else {
    score += 4;
  }

  // Work-study compatibility: shorter/tech paths suit students who need to work
  if (perfil.trabajar === 'Sí, desde el inicio' && carrera.tipo !== 'Universitaria') {
    score += 8;
  } else if (perfil.trabajar === 'Sí, desde el inicio' && perfil.modalidad === 'virtual') {
    score += 4;
  } else if (perfil.trabajar === 'A partir de 3er semestre' && carrera.tipo !== 'Universitaria') {
    score += 3;
  }

  // Regional demand scoring
  const demandaLocal =
    carrera.demandaPorRegion[perfil.regionId as keyof typeof carrera.demandaPorRegion] ?? 50;
  const disponibles: string[] = perfil.regionesDisponibles ?? [];

  if (disponibles.length === 0) {
    score += (demandaLocal - 60) * 0.35;
  } else {
    const regionesActivas = [perfil.regionId, ...disponibles];
    const topDemanda = Math.max(
      ...regionesActivas.map(
        (r) => carrera.demandaPorRegion[r as keyof typeof carrera.demandaPorRegion] ?? 0
      )
    );
    score += (topDemanda - 60) * 0.28;
  }

  // Employability quality bonus (max +5)
  const empRate = carrera.tasaEmpleabilidad12m ?? carrera.empleabilidad;
  if (empRate >= 92) score += 5;
  else if (empRate >= 85) score += 3;
  else if (empRate < 65) score -= 4;

  // Accreditation signal
  if (carrera.acreditadaAltaCalidad) score += 3;

  // High-achiever bonus: strong student + competitive career
  if (perfil.promedio >= 4.5 && carrera.empleabilidad >= 85) score += 4;
  else if (perfil.promedio >= 4.0 && carrera.empleabilidad >= 90) score += 2;

  return Math.max(35, Math.min(98, Math.round(score)));
}
