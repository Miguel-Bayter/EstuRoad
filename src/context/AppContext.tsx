import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Perfil, TypeChoice, ViewChoice, AuthUser } from '../types';
import { DEFAULT_PERFIL } from '../data/constants';

interface AppContextValue {
  profile: Perfil;
  setProfile: (p: Perfil | ((prev: Perfil) => Perfil)) => void;
  typeChoice: TypeChoice;
  setTypeChoice: (t: TypeChoice) => void;
  viewChoice: ViewChoice;
  setViewChoice: (v: ViewChoice) => void;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileRaw] = useState<Perfil>(() =>
    loadStorage<Perfil>('er.profile', DEFAULT_PERFIL as Perfil)
  );
  const [typeChoice, setTypeChoice] = useState<TypeChoice>('fraunces-geist');
  const [viewChoice, setViewChoice] = useState<ViewChoice>('list');
  const [user, setUser] = useState<AuthUser | null>(() =>
    loadStorage<AuthUser | null>('er.user', null)
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    loadStorage<string[]>('er.favorites', [])
  );

  const setProfile = useCallback(
    (p: Perfil | ((prev: Perfil) => Perfil)) => setProfileRaw(p),
    []
  );
  const login = useCallback((u: AuthUser) => setUser(u), []);
  const logout = useCallback(() => setUser(null), []);
  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);
  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  useEffect(() => {
    localStorage.setItem('er.profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('er.user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('er.favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    document.documentElement.setAttribute('data-type', typeChoice);
  }, [typeChoice]);

  const value = useMemo<AppContextValue>(
    () => ({
      profile,
      setProfile,
      typeChoice,
      setTypeChoice,
      viewChoice,
      setViewChoice,
      user,
      login,
      logout,
      favorites,
      toggleFavorite,
      isFavorite,
    }),
    [profile, setProfile, typeChoice, viewChoice, user, login, logout, favorites, toggleFavorite, isFavorite]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
