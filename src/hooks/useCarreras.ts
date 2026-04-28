import { useCallback, useEffect, useRef, useState } from 'react';
import { carrerasApi } from '../api';
import type { Carrera, Perfil } from '../types';
import { scoreCarrera } from '../utils/scoring';

interface UseCarrerasResult {
  carreras: Carrera[];
  ranked: Carrera[];
  loading: boolean;
  error: string | null;
  warning: string | null;
  refetch: () => void;
}

let carrerasCache: Carrera[] | null = null;
let staleCache: Carrera[] | null = null;

export function useCarreras(perfil: Perfil): UseCarrerasResult {
  const [carreras, setCarreras] = useState<Carrera[]>(() => carrerasCache ?? []);
  const [loading, setLoading] = useState(carrerasCache === null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const doFetch = useCallback(() => {
    if (carrerasCache) {
      setCarreras(carrerasCache);
      setLoading(false);
      return;
    }
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setError(null);
    setWarning(null);

    carrerasApi
      .list()
      .then((data) => {
        carrerasCache = data;
        staleCache = data;
        setCarreras(data);
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return;
        const msg =
          err.name === 'TimeoutError'
            ? 'Tiempo de espera agotado. Verifica tu conexión.'
            : 'Sin conexión. Algunos datos pueden estar desactualizados.';
        if (staleCache) {
          carrerasCache = staleCache;
          setCarreras(staleCache);
          setWarning(msg);
        } else {
          setError(msg);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const refetch = useCallback(() => {
    carrerasCache = null;
    doFetch();
  }, [doFetch]);

  useEffect(() => {
    doFetch();
    return () => abortRef.current?.abort();
  }, [doFetch]);

  const ranked = [...carreras]
    .map((c) => ({ ...c, score: scoreCarrera(c, perfil) }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return { carreras, ranked, loading, error, warning, refetch };
}
