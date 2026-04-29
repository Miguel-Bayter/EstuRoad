import { adaptCarrera, type ApiCarrera } from './adapters';
import type { Carrera, Perfil, AuthUser } from '../types';

// Public carreras data — external Vercel API, no auth needed
const CARRERAS_BASE = import.meta.env.VITE_API_URL ?? 'https://eduroad-api.vercel.app/api';

// User profiles — own backend (proxied via /api in dev and prod)
const PERFILES_BASE = '/api';

async function publicRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${CARRERAS_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(10_000),
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? body.message ?? `HTTP ${res.status}`);
  return body as T;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PERFILES_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(10_000),
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.error ?? body.message ?? `HTTP ${res.status}`);
  }

  return body as T;
}

// --- Carreras ---
export const carrerasApi = {
  list: async (): Promise<Carrera[]> => {
    const data = await publicRequest<{ items: ApiCarrera[] }>('/carreras/?limit=100');
    return data.items.map(adaptCarrera);
  },

  get: async (slug: string): Promise<Carrera> => {
    const raw = await publicRequest<ApiCarrera>(`/carreras/${slug}`);
    return adaptCarrera(raw);
  },

  recomendaciones: async (_perfil: Omit<Perfil, '_id'>): Promise<Carrera[]> => {
    // Scoring is done client-side via scoreCarrera(); fetch full list
    const data = await publicRequest<{ items: ApiCarrera[] }>('/carreras/?limit=100');
    return data.items.map(adaptCarrera);
  },
};

// --- Perfiles ---
export const perfilesApi = {
  create: (perfil: Omit<Perfil, '_id'>) =>
    request<Perfil>('/perfiles', { method: 'POST', body: JSON.stringify(perfil) }),
  get: (id: string) => request<Perfil>(`/perfiles/${id}`),
  update: (id: string, patch: Partial<Perfil>) =>
    request<Perfil>(`/perfiles/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
};

// --- Auth (session-aware profile operations) ---
interface PerfilApiResponse {
  publicId: string;
  ciudad: string;
  estrato: number;
  presupuesto: number;
  intereses: string[];
}

interface CreatePerfilResult {
  perfil: PerfilApiResponse;
  sessionToken?: string; // present on external API; local server uses httpOnly cookie instead
}

export const authApi = {
  create: (perfil: Omit<Perfil, '_id'>): Promise<CreatePerfilResult> =>
    request<CreatePerfilResult>('/perfiles/', {
      method: 'POST',
      body: JSON.stringify({
        ciudad: perfil.ciudad,
        estrato: perfil.estrato,
        presupuesto: perfil.presupuesto,
        intereses: perfil.intereses,
      }),
    }),

  recover: (publicId: string): Promise<PerfilApiResponse> =>
    request<PerfilApiResponse>(`/perfiles/${publicId}`),

  toAuthUser: (result: CreatePerfilResult): AuthUser => ({
    publicId: result.perfil.publicId,
    ciudad: result.perfil.ciudad,
  }),
};
