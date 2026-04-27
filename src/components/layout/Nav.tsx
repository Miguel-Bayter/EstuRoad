import { useState } from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AuthModal } from './AuthModal';

function NavTab({ to, label, end }: { to: string; label: string; end?: boolean }) {
  const match = useMatch(end ? { path: to, end: true } : to);
  return (
    <Link
      to={to}
      className={`nav-tab${match ? ' is-active' : ''}`}
      aria-current={match ? 'page' : undefined}
    >
      {label}
    </Link>
  );
}

export function Nav() {
  const { profile, user, logout } = useApp();
  const canResults = profile.completed;
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  function copyId() {
    if (!user) return;
    navigator.clipboard.writeText(user.publicId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const tabs = [
    { to: '/', label: 'Inicio', end: true },
    { to: '/perfil', label: 'Mi perfil', end: false },
    { to: '/resultados', label: 'Resultados', locked: !canResults, end: false },
    { to: '/comparar', label: 'Comparador', locked: !canResults, end: false },
    { to: '/mapa', label: 'Mapa', locked: !canResults, end: false },
  ];

  return (
    <>
      <nav role="navigation" aria-label="Navegación principal" className="nav">
        <div className="nav-left">
          <div className="logo" role="link" tabIndex={0} onClick={() => navigate('/')} onKeyDown={(e) => e.key === 'Enter' && navigate('/')}>
            <div className="logo-mark">e</div>
            <span>EstuRoad</span>
          </div>
          <div className="nav-tabs">
            {tabs.map((t) =>
              t.locked ? (
                <span key={t.to} className="nav-tab" aria-disabled="true">{t.label}</span>
              ) : (
                <NavTab key={t.to} to={t.to} label={t.label} end={t.end} />
              )
            )}
          </div>
        </div>
        <div className="nav-right">
          <button
            type="button"
            className="nav-hamburger"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
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
              <button type="button" className="session-exit" title="Cerrar sesión" onClick={logout}>
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

        {mobileOpen && (
          <div className="nav-mobile" onClick={() => setMobileOpen(false)}>
            {tabs.map((t) =>
              t.locked ? (
                <span key={t.to} className="nav-tab" aria-disabled="true">{t.label}</span>
              ) : (
                <NavTab key={t.to} to={t.to} label={t.label} end={t.end} />
              )
            )}
          </div>
        )}
      </nav>
      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
