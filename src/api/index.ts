import { adaptCarrera, type ApiCarrera } from './adapters';
import type { Carrera, Perfil, AuthUser } from '../types';

// In dev, Vite proxies /api → eduroad-api.vercel.app
// In prod, set VITE_API_URL=https://eduroad-api.vercel.app/api
const BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
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
    const data = await request<{ items: ApiCarrera[] }>('/carreras/?limit=100');
    return data.items.map(adaptCarrera);
  },

  get: async (slug: string): Promise<Carrera> => {
    const raw = await request<ApiCarrera>(`/carreras/${slug}`);
    return adaptCarrera(raw);
  },

  recomendaciones: async (_perfil: Omit<Perfil, '_id'>): Promise<Carrera[]> => {
    // Scoring is done client-side via scoreCarrera(); fetch full list
    const data = await request<{ items: ApiCarrera[] }>('/carreras/?limit=100');
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
  sessionToken: string;
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
    sessionToken: result.sessionToken,
    ciudad: result.perfil.ciudad,
  }),
};
