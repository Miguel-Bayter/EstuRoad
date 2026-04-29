import type { Carrera, DemandaPorRegion, Universidad } from '../types';

// --- Raw API types (new Vercel API) ---

interface ApiDemandaPorRegion {
  Bogotá?: number;
  Antioquia?: number;
  'Valle del Cauca'?: number;
  Atlántico?: number;
  Santander?: number;
  Cundinamarca?: number;
  [key: string]: number | undefined;
}

export interface ApiCarrera {
  slug: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  tipo: string;
  duracionSemestres: number;
  costoSemestre: number;
  salarioEntrada: number;
  salarioMedio: number;
  salarioMediana: number;
  empleabilidad: number;
  tasaEmpleabilidad12m: number;
  demandaPorRegion: ApiDemandaPorRegion;
  universidades: string[];
  habilidadesRequeridas: string[];
  tags: string[];
  proyeccion2030: string;
  acreditadaAltaCalidad: boolean;
  ultimaActualizacion: string;
  cineCode: string;
}

// --- Lookup tables ---

const RIASEC_BY_CATEGORIA: Record<string, string[]> = {
  'Ingeniería y afines': ['I', 'R', 'C'],
  'Ciencias de la salud': ['I', 'S', 'R'],
  'Ciencias sociales y humanas': ['S', 'A', 'I'],
  'Economía y administración': ['E', 'C', 'I'],
  'Bellas artes': ['A', 'R', 'I'],
  'Derecho y ciencias políticas': ['E', 'S', 'C'],
  'Ciencias de la educación': ['S', 'A', 'I'],
  'Matemáticas y ciencias naturales': ['I', 'R', 'C'],
  'Agronomía y veterinaria': ['R', 'I', 'S'],
};

const INTERESES_BY_CATEGORIA: Record<string, string[]> = {
  'Ciencias de la salud': ['salud'],
  'Ciencias sociales y humanas': ['social'],
  'Economía y administración': ['negocios'],
  'Bellas artes': ['arte'],
  'Derecho y ciencias políticas': ['justicia'],
  'Ciencias de la educación': ['educacion'],
  'Matemáticas y ciencias naturales': ['ingenieria'],
  'Agronomía y veterinaria': ['agro'],
};

const CITY_BY_UNIVERSITY: Record<string, string> = {
  'Universidad Nacional de Colombia': 'Bogotá',
  'Universidad de los Andes': 'Bogotá',
  'Pontificia Universidad Javeriana': 'Bogotá',
  'Universidad Externado de Colombia': 'Bogotá',
  'Universidad del Rosario': 'Bogotá',
  'Universidad de la Sabana': 'Bogotá',
  'Universidad El Bosque': 'Bogotá',
  'Universidad Jorge Tadeo Lozano': 'Bogotá',
  'Universidad Santo Tomás': 'Bogotá',
  'Universidad Libre': 'Bogotá',
  'Universidad Distrital Francisco José de Caldas': 'Bogotá',
  Uniminuto: 'Bogotá',
  'Universidad Cooperativa de Colombia': 'Bogotá',
  'Universidad Pedagógica Nacional': 'Bogotá',
  CESAS: 'Bogotá',
  'Universidad EAFIT': 'Medellín',
  'Universidad de Antioquia': 'Medellín',
  'Politecnico Colombiano Jaime Isaza Cadavid': 'Medellín',
  'Institución Universitaria Digital de Antioquia': 'Medellín',
  'Universidad EIA': 'Medellín',
  'Universidad CES': 'Medellín',
  'Universidad del Norte': 'Barranquilla',
  'Universidad del Valle': 'Cali',
  'Universidad Santiago de Cali': 'Cali',
  'Universidad Industrial de Santander': 'Bucaramanga',
  'Universidad de Caldas': 'Manizales',
  'Universidad de Manizales': 'Manizales',
  'Universidad del Tolima': 'Ibagué',
  'Universidad de Nariño': 'Pasto',
  'Universidad de Cartagena': 'Cartagena',
  'Universidad de Córdoba': 'Montería',
  'Universidad Pedagógica y Tecnológica de Colombia': 'Tunja',
  SENA: 'Nacional',
};

const PUBLIC_KEYWORDS = [
  'Nacional',
  'Distrital',
  'de Antioquia',
  'del Valle',
  'de Córdoba',
  'de Nariño',
  'Pedagógica',
  'Industrial de Santander',
  'SENA',
  'del Atlántico',
  'de Caldas',
  'del Tolima',
  'de Cartagena',
  'Tecnológica de Pereira',
  'Surcolombiana',
  'Pedagógica y Tecnológica',
];

// --- Helper functions ---

function avg(nums: number[]): number {
  if (!nums.length) return 50;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function capitalizeType(tipo: string): 'Universitaria' | 'Tecnológica (SENA)' | 'Tecnológica' {
  const t = tipo.toLowerCase();
  if (t.includes('sena')) return 'Tecnológica (SENA)';
  if (t.startsWith('univ')) return 'Universitaria';
  return 'Tecnológica';
}

function deriveRiasec(categoria: string, tags: string[]): string[] {
  const base = RIASEC_BY_CATEGORIA[categoria] ?? ['I', 'R', 'C'];
  const tagStr = tags.join(' ').toLowerCase();
  if (/software|datos|ia|programación|web|móvil|machine/.test(tagStr)) {
    return [...new Set([...base, 'C'])].slice(0, 3);
  }
  return base;
}

function deriveIntereses(categoria: string, tags: string[]): string[] {
  const result: string[] = INTERESES_BY_CATEGORIA[categoria]
    ? [...INTERESES_BY_CATEGORIA[categoria]]
    : [];

  if (categoria.includes('Ingeniería') && result.length === 0) {
    const tagStr = tags.join(' ').toLowerCase();
    if (/tecnolog|software|datos|ia|programación|web|móvil|machine/.test(tagStr))
      result.push('tech');
    if (/ambiente|sostenib|agua|residuos|climático/.test(tagStr)) result.push('ambiente');
    if (/salud|médic|biomed/.test(tagStr)) result.push('salud');
    if (result.length === 0) result.push('ingenieria');
  }

  // Cross-category enrichments
  const tagStr = tags.join(' ').toLowerCase();
  if (/periodismo|medios|contenidos/.test(tagStr)) result.push('comunicacion');
  if (/deporte|atlético|rehabilitación/.test(tagStr)) result.push('deporte');
  if (/social|comunid/.test(tagStr) && !result.includes('social')) result.push('social');

  return [...new Set(result)];
}

function deriveDemanda(empleabilidad: number): string {
  if (empleabilidad >= 90) return 'Muy alta';
  if (empleabilidad >= 80) return 'Alta';
  if (empleabilidad >= 70) return 'Media';
  return 'Baja';
}

function mapToMacroregiones(d: ApiDemandaPorRegion): DemandaPorRegion {
  const andinaVals = (
    [d['Bogotá'], d['Antioquia'], d['Santander'], d['Cundinamarca']] as (number | undefined)[]
  ).filter((v): v is number => v !== undefined);

  const andina = avg(andinaVals);
  // +8 correction: Caribe covers multiple cities beyond Barranquilla
  const caribe = Math.min(100, (d['Atlántico'] ?? 45) + 8);
  const pacifico = d['Valle del Cauca'] ?? 50;
  // Orinoquía/Amazonía/Insular estimated from andina proportion
  const orinoquia = Math.round(andina * 0.52);
  const amazonia = Math.round(andina * 0.38);
  const insular = Math.round(andina * 0.32);

  return { andina, caribe, pacifico, orinoquia, amazonia, insular };
}

function deriveRegionesDemanda(d: ApiDemandaPorRegion): string[] {
  const mapped = mapToMacroregiones(d);
  return (Object.entries(mapped) as [string, number][]).filter(([, v]) => v >= 70).map(([k]) => k);
}

function buildUniversidades(names: string[], costoSemestre: number): Universidad[] {
  return names.map((nombre, i) => {
    const isPublic = PUBLIC_KEYWORDS.some((k) => nombre.includes(k));
    const ciudad = CITY_BY_UNIVERSITY[nombre] ?? 'Bogotá';
    return {
      nombre,
      ciudad,
      publica: isPublic,
      costoSem: isPublic ? 600000 : costoSemestre,
      ranking: i + 1,
    };
  });
}

function buildStayVsLeave(raw: ApiCarrera): { stay: string; leave: string } {
  const regionVals = Object.entries(raw.demandaPorRegion ?? {}).filter(
    (e): e is [string, number] => typeof e[1] === 'number'
  );
  const topCity = regionVals.sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Bogotá';
  const topScore = regionVals[0]?.[1] ?? 75;
  const habs = (raw.habilidadesRequeridas ?? []).slice(0, 2);

  return {
    stay: `La demanda regional por ${raw.nombre} sigue creciendo. Las habilidades más valoradas son ${habs.join(' y ') || 'análisis y comunicación'}. Busca opciones en universidades locales con costos desde ${((raw.costoSemestre ?? 0) / 1_000_000).toFixed(1)}M/sem.`,
    leave: `${topCity} concentra la mayor demanda nacional (${topScore}/100). Salario medio esperado: $${((raw.salarioMedio ?? 0) / 1_000_000).toFixed(1)}M. ${(raw.proyeccion2030 ?? '').split('.')[0]}.`,
  };
}

function extractProyeccion(raw: string): string {
  const first = raw.split('.')[0].trim();
  return first.length <= 20 ? first : first.split(' ').slice(0, 2).join(' ');
}

// --- Main adapter ---

export function adaptCarrera(raw: ApiCarrera): Carrera {
  // Sanitize & normalize API values
  const empleabilidad = Math.max(0, Math.min(100, raw.empleabilidad ?? 50));
  let salarioEntrada = raw.salarioEntrada ?? 0;
  let salarioMedio = raw.salarioMedio ?? 0;
  if (salarioMedio > 0 && salarioEntrada > 0 && salarioMedio < salarioEntrada) {
    [salarioEntrada, salarioMedio] = [salarioMedio, salarioEntrada];
  }
  const univNames = Array.isArray(raw.universidades) ? raw.universidades : [];
  const tags = Array.isArray(raw.tags) ? raw.tags : [];
  const costoSemestre = raw.costoSemestre ?? 0;
  const demandaRegion = raw.demandaPorRegion ?? {};

  return {
    _id: raw.slug,
    slug: raw.slug,
    nombre: raw.nombre,
    tipo: capitalizeType(raw.tipo),
    duracion: `${raw.duracionSemestres} semestres`,
    categoria: raw.categoria,
    ematch: deriveRiasec(raw.categoria, tags),
    intereses: deriveIntereses(raw.categoria, tags),
    resumen: raw.descripcion,
    salarioEntrada,
    salarioMedio,
    salarioAlto: Math.round(salarioMedio * 1.65),
    empleabilidad,
    demanda: deriveDemanda(empleabilidad),
    costoSemestre,
    becasICETEX: raw.acreditadaAltaCalidad || costoSemestre <= 4500000,
    regionesDemanda: deriveRegionesDemanda(demandaRegion),
    demandaPorRegion: mapToMacroregiones(demandaRegion),
    universidades: buildUniversidades(univNames, costoSemestre),
    stayVsLeave: buildStayVsLeave(raw),
    proyeccion2030: extractProyeccion(raw.proyeccion2030 ?? 'Media'),
    // Extended fields
    salarioMediana: raw.salarioMediana,
    tasaEmpleabilidad12m: raw.tasaEmpleabilidad12m,
    habilidadesRequeridas: Array.isArray(raw.habilidadesRequeridas)
      ? raw.habilidadesRequeridas
      : [],
    tags,
    acreditadaAltaCalidad: raw.acreditadaAltaCalidad ?? false,
    cineCode: raw.cineCode,
  };
}
