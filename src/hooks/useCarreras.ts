import { useCallback, useEffect, useRef, useState } from 'react';
import { carrerasApi } from '../api';
import type { Carrera, Perfil } from '../types';
import { scoreCarrera } from '../utils/scoring';

interface UseCarrerasResult {
  carreras: Carrera[];
  ranked: Carrera[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCarreras(perfil: Perfil): UseCarrerasResult {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetch = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setError(null);

    carrerasApi
      .list()
      .then(setCarreras)
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch();
    return () => abortRef.current?.abort();
  }, [fetch]);

  const ranked = [...carreras]
    .map((c) => ({ ...c, score: scoreCarrera(c, perfil) }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return { carreras, ranked, loading, error, refetch: fetch };
}
