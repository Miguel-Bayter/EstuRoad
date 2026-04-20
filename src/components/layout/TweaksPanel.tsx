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
    <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 50 }}>
      {open && (
        <div className="tweaks" style={{ position: 'static', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', opacity: .7, fontFamily: 'var(--font-ui)', fontWeight: 600 }}>Apariencia</span>
            <button type="button" onClick={() => setOpen(false)} style={{ border: 0, background: 'transparent', color: 'var(--paper)', fontSize: 18, lineHeight: 1, cursor: 'pointer', opacity: .6 }}>✕</button>
          </div>
          <div className="tweaks-group">
            <h5>Tipografía</h5>
            <div className="opts">
              {TYPE_OPTIONS.map((o) => (
                <button key={o.v} type="button" className={typeChoice === o.v ? 'is-active' : ''} onClick={() => setTypeChoice(o.v)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div className="tweaks-group">
            <h5>Vista de resultados</h5>
            <div className="opts">
              {VIEW_OPTIONS.map((o) => (
                <button key={o.v} type="button" className={viewChoice === o.v ? 'is-active' : ''} onClick={() => setViewChoice(o.v)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 44, height: 44,
          borderRadius: '999px',
          background: 'var(--ink)',
          border: '1px solid rgba(255,253,246,.15)',
          color: 'var(--paper)',
          fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,.25)',
          marginLeft: 'auto',
        }}
        title="Personalizar apariencia"
      >
        ⚙
      </button>
    </div>
  );
}
