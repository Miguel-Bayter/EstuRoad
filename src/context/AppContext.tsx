import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Perfil, Screen, TypeChoice, ViewChoice, AuthUser } from '../types';
import { DEFAULT_PERFIL } from '../data/constants';

interface AppContextValue {
  screen: Screen;
  setScreen: (s: Screen) => void;
  profile: Perfil;
  setProfile: (p: Perfil | ((prev: Perfil) => Perfil)) => void;
  detailSlug: string;
  setDetailSlug: (slug: string) => void;
  typeChoice: TypeChoice;
  setTypeChoice: (t: TypeChoice) => void;
  viewChoice: ViewChoice;
  setViewChoice: (v: ViewChoice) => void;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
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
  const [screen, setScreenRaw] = useState<Screen>(() =>
    loadStorage<Screen>('er.screen', 'landing')
  );
  const [profile, setProfileRaw] = useState<Perfil>(() =>
    loadStorage<Perfil>('er.profile', DEFAULT_PERFIL as Perfil)
  );
  const [detailSlug, setDetailSlug] = useState('ing-sistemas');
  const [typeChoice, setTypeChoice] = useState<TypeChoice>('fraunces-geist');
  const [viewChoice, setViewChoice] = useState<ViewChoice>('cards');
  const [user, setUser] = useState<AuthUser | null>(() =>
    loadStorage<AuthUser | null>('er.user', null)
  );

  const setScreen = useCallback((s: Screen) => setScreenRaw(s), []);
  const setProfile = useCallback(
    (p: Perfil | ((prev: Perfil) => Perfil)) => setProfileRaw(p),
    []
  );
  const login = useCallback((u: AuthUser) => setUser(u), []);
  const logout = useCallback(() => setUser(null), []);

  useEffect(() => {
    localStorage.setItem('er.screen', JSON.stringify(screen));
  }, [screen]);

  useEffect(() => {
    localStorage.setItem('er.profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('er.user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-type', typeChoice);
  }, [typeChoice]);

  const value = useMemo<AppContextValue>(
    () => ({
      screen,
      setScreen,
      profile,
      setProfile,
      detailSlug,
      setDetailSlug,
      typeChoice,
      setTypeChoice,
      viewChoice,
      setViewChoice,
      user,
      login,
      logout,
    }),
    [screen, setScreen, profile, setProfile, detailSlug, typeChoice, viewChoice, user, login, logout]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
