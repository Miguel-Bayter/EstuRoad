import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Screen } from '../../types';
import { AuthModal } from './AuthModal';

export function Nav() {
  const { screen, setScreen, profile, user, logout } = useApp();
  const canResults = profile.completed;
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyId() {
    if (!user) return;
    navigator.clipboard.writeText(user.publicId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

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
          {user ? (
            <div className="nav-session">
              <button
                type="button"
                className={`session-pill${copied ? ' session-pill--copied' : ''}`}
                title={`Tu código: ${user.publicId} — clic para copiar`}
                onClick={copyId}
              >
                <span className="session-city">
                  <span className="pill-dot" />
                  {profile.ciudad || 'Colombia'}
                </span>
                <span className="session-sep" aria-hidden />
                <span className="session-code mono">
                  {copied ? '¡Copiado!' : `${user.publicId.slice(0, 8)}…`}
                </span>
                {!copied && (
                  <svg className="session-copy-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
              <button
                type="button"
                className="session-exit"
                title="Cerrar sesión"
                onClick={logout}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Salir</span>
              </button>
            </div>
          ) : (
            <>
              <span className="pill">
                <span className="pill-dot" />
                {profile.ciudad || 'Colombia'}
              </span>
              <button type="button" className="btn sm ghost" onClick={() => setModalOpen(true)}>
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </nav>
      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
