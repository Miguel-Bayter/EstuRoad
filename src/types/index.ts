export interface Universidad {
  nombre: string;
  ciudad: string;
  publica: boolean;
  costoSem: number;
  ranking: number;
}

export interface DemandaPorRegion {
  andina: number;
  caribe: number;
  pacifico: number;
  orinoquia: number;
  amazonia: number;
  insular: number;
}

export interface Carrera {
  _id: string;
  slug: string;
  nombre: string;
  tipo: 'Universitaria' | 'Tecnológica (SENA)' | 'Tecnológica';
  duracion: string;
  categoria: string;
  ematch: string[];
  intereses: string[];
  resumen: string;
  salarioEntrada: number;
  salarioMedio: number;
  salarioAlto: number;
  empleabilidad: number;
  demanda: string;
  costoSemestre: number;
  becasICETEX: boolean;
  regionesDemanda: string[];
  demandaPorRegion: DemandaPorRegion;
  universidades: Universidad[];
  stayVsLeave: { stay: string; leave: string };
  proyeccion2030: string;
  score?: number;
}

export interface Perfil {
  _id?: string;
  ciudad: string;
  regionId: string;
  estrato: number;
  grado: string;
  colegioTipo: string;
  promedio: number;
  saber: string;
  presupuesto: number;
  icetex: string;
  trabajar: string;
  materias: string[];
  intereses: string[];
  riasec: string[];
  habilidades: string[];
  mudarse: number;
  modalidad: 'presencial' | 'virtual' | 'hibrido' | '';
  internacional: string;
  completed: boolean;
}

export type Screen = 'landing' | 'onboarding' | 'results' | 'detail' | 'compare' | 'map';

export type TypeChoice = 'fraunces-geist' | 'serif-editorial' | 'grotesk' | 'dm-geist';
export type ViewChoice = 'list' | 'cards' | 'map';
