export const REGIONES = [
  {
    id: 'andina',
    nombre: 'Región Andina',
    ciudades: [
      'Bogotá',
      'Medellín',
      'Cali',
      'Bucaramanga',
      'Manizales',
      'Pereira',
      'Tunja',
      'Pasto',
    ],
  },
  {
    id: 'caribe',
    nombre: 'Región Caribe',
    ciudades: [
      'Barranquilla',
      'Cartagena',
      'Santa Marta',
      'Montería',
      'Valledupar',
      'Sincelejo',
      'Riohacha',
    ],
  },
  {
    id: 'pacifico',
    nombre: 'Región Pacífica',
    ciudades: ['Buenaventura', 'Quibdó', 'Tumaco', 'Guapi'],
  },
  {
    id: 'orinoquia',
    nombre: 'Orinoquía',
    ciudades: ['Villavicencio', 'Yopal', 'Arauca', 'Puerto Carreño'],
  },
  {
    id: 'amazonia',
    nombre: 'Amazonía',
    ciudades: ['Leticia', 'Mocoa', 'Florencia', 'San José del Guaviare'],
  },
  { id: 'insular', nombre: 'Insular', ciudades: ['San Andrés', 'Providencia'] },
] as const;

export const CIUDADES = REGIONES.flatMap((r) =>
  r.ciudades.map((c) => ({ ciudad: c, region: r.nombre, regionId: r.id }))
);

export const MATERIAS = [
  'Matemáticas',
  'Español',
  'Ciencias naturales',
  'Biología',
  'Química',
  'Física',
  'Historia',
  'Geografía',
  'Sociales',
  'Arte y música',
  'Educación física',
  'Tecnología e informática',
  'Inglés',
  'Filosofía',
] as const;

export const INTERESES = [
  { k: 'tech', label: 'Tecnología y código' },
  { k: 'salud', label: 'Salud y cuidado' },
  { k: 'agro', label: 'Agro y territorio' },
  { k: 'arte', label: 'Arte, música y cultura' },
  { k: 'negocios', label: 'Negocios y emprender' },
  { k: 'comunicacion', label: 'Comunicación y medios' },
  { k: 'ambiente', label: 'Medio ambiente' },
  { k: 'ingenieria', label: 'Ingeniería y construir' },
  { k: 'social', label: 'Impacto social' },
  { k: 'justicia', label: 'Leyes y justicia' },
  { k: 'educacion', label: 'Educar a otros' },
  { k: 'deporte', label: 'Deporte y movimiento' },
] as const;

export const HABILIDADES = [
  'Creatividad',
  'Liderazgo',
  'Pensamiento lógico',
  'Empatía',
  'Comunicación',
  'Trabajo manual',
  'Resolución de problemas',
  'Disciplina',
  'Curiosidad',
  'Trabajo en equipo',
  'Autonomía',
  'Análisis de datos',
] as const;

export const RIASEC = [
  {
    k: 'R',
    titulo: 'Realista',
    desc: 'Construir, reparar, trabajar con las manos o al aire libre.',
  },
  {
    k: 'I',
    titulo: 'Investigador',
    desc: 'Analizar, experimentar, resolver acertijos y entender por qué.',
  },
  { k: 'A', titulo: 'Artístico', desc: 'Crear, expresar, diseñar; romper lo convencional.' },
  { k: 'S', titulo: 'Social', desc: 'Ayudar, enseñar, cuidar, acompañar a otras personas.' },
  { k: 'E', titulo: 'Emprendedor', desc: 'Liderar, persuadir, mover equipos y abrir camino.' },
  {
    k: 'C',
    titulo: 'Convencional',
    desc: 'Organizar, planear, trabajar con reglas claras y datos.',
  },
] as const;

export const DEFAULT_PERFIL = {
  ciudad: 'Barranquilla',
  regionId: 'caribe',
  estrato: 2,
  grado: 'Grado 11',
  colegioTipo: 'Público',
  promedio: 4.2,
  saber: '300–349',
  presupuesto: 2000000,
  icetex: 'Sí, claro',
  trabajar: 'A partir de 3er semestre',
  materias: ['Matemáticas', 'Biología', 'Sociales'],
  intereses: ['tech', 'social', 'ambiente'],
  riasec: ['I', 'S', 'A'],
  habilidades: ['Creatividad', 'Pensamiento lógico', 'Empatía'],
  mudarse: 45,
  regionesDisponibles: [],
  modalidad: '',
  internacional: 'Solo si hay beca',
  completed: false,
};
