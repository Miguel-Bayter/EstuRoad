import type { Carrera, Perfil } from '../types';

// Vite proxy forwards /api → http://localhost:3001/api in dev
const BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }

  return body.data as T;
}

// --- Carreras ---
export const carrerasApi = {
  list: () => request<Carrera[]>('/carreras'),
  get: (slug: string) => request<Carrera>(`/carreras/${slug}`),
  recomendaciones: (perfil: Omit<Perfil, '_id'>) =>
    request<Carrera[]>('/carreras/recomendaciones', {
      method: 'POST',
      body: JSON.stringify(perfil),
    }),
};

// --- Perfiles ---
export const perfilesApi = {
  create: (perfil: Omit<Perfil, '_id'>) =>
    request<Perfil>('/perfiles', { method: 'POST', body: JSON.stringify(perfil) }),
  get: (id: string) => request<Perfil>(`/perfiles/${id}`),
  update: (id: string, patch: Partial<Perfil>) =>
    request<Perfil>(`/perfiles/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
};
