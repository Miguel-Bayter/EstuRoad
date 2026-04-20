import { useApp } from '../../context/AppContext';
import type { Screen } from '../../types';

export function Nav() {
  const { screen, setScreen, profile } = useApp();
  const canResults = profile.completed;

  const tabs: { id: Screen; label: string; locked?: boolean }[] = [
    { id: 'landing', label: 'Inicio' },
    { id: 'onboarding', label: 'Mi perfil' },
    { id: 'results', label: 'Resultados', locked: !canResults },
    { id: 'compare', label: 'Comparador', locked: !canResults },
    { id: 'map', label: 'Mapa', locked: !canResults },
  ];

  return (
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
        <button type="button" className="btn sm ghost">
          Iniciar sesión
        </button>
      </div>
    </nav>
  );
}
