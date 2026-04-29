import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { TypeChoice, ViewChoice } from '../../types';

const TYPE_OPTIONS: { v: TypeChoice; label: string }[] = [
  { v: 'fraunces-geist', label: 'Fraunces' },
  { v: 'serif-editorial', label: 'Serif Ed.' },
  { v: 'grotesk', label: 'Grotesk' },
  { v: 'dm-geist', label: 'DM Serif' },
];

const VIEW_OPTIONS: { v: ViewChoice; label: string }[] = [
  { v: 'list', label: 'Lista' },
  { v: 'cards', label: 'Tarjetas' },
  { v: 'map', label: 'Mapa' },
];

export function TweaksPanel() {
  const { typeChoice, setTypeChoice, viewChoice, setViewChoice } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="tweaks-fab">
      {open && (
        <div className="tweaks">
          <div className="tweaks-header">
            <span className="tweaks-label">Apariencia</span>
            <button type="button" className="tweaks-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          <div className="tweaks-group">
            <h5>Tipografía</h5>
            <div className="opts">
              {TYPE_OPTIONS.map((o) => (
                <button
                  key={o.v}
                  type="button"
                  className={typeChoice === o.v ? 'is-active' : ''}
                  onClick={() => setTypeChoice(o.v)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div className="tweaks-group">
            <h5>Vista de resultados</h5>
            <div className="opts">
              {VIEW_OPTIONS.map((o) => (
                <button
                  key={o.v}
                  type="button"
                  className={viewChoice === o.v ? 'is-active' : ''}
                  onClick={() => setViewChoice(o.v)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        className="tweaks-fab-btn"
        onClick={() => setOpen((v) => !v)}
        title="Personalizar apariencia"
      >
        ⚙
      </button>
    </div>
  );
}
