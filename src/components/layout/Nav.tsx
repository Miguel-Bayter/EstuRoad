import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Screen } from '../../types';
import { AuthModal } from './AuthModal';

export function Nav() {
  const { screen, setScreen, profile, user, logout } = useApp();
  const canResults = profile.completed;
  const [modalOpen, setModalOpen] = useState(false);

  const tabs: { id: Screen; label: string; locked?: boolean }[] = [
    { id: 'landing', label: 'Inicio' },
    { id: 'onboarding', label: 'Mi perfil' },
    { id: 'results', label: 'Resultados', locked: !canResults },
    { id: 'compare', label: 'Comparador', locked: !canResults },
    { id: 'map', label: 'Mapa', locked: !canResults },
  ];

  return (
    <>
      <nav className="nav">
        <div className="nav-left">
          <div className="logo">
            <div className="logo-mark">e</div>
            <span>EstuRoad</span>
          </div>
          <div className="nav-tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`nav-tab ${screen === t.id ? 'is-active' : ''}`}
                disabled={t.locked}
                onClick={() => !t.locked && setScreen(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="nav-right">
          <span className="pill">
            <span className="pill-dot" />
            {profile.ciudad || 'Colombia'}
          </span>
          {user ? (
            <div className="nav-user">
              <span className="nav-user-id mono" title={user.publicId}>
                {user.publicId.slice(0, 8)}…
              </span>
              <button type="button" className="btn sm ghost" onClick={logout}>
                Salir
              </button>
            </div>
          ) : (
            <button type="button" className="btn sm ghost" onClick={() => setModalOpen(true)}>
              Iniciar sesión
            </button>
          )}
        </div>
      </nav>
      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
