import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { useCarreras } from '../../../hooks/useCarreras';
import { ColombiaMap } from '../../ui/ColombiaMap';
import { Skeleton } from '../../ui/Skeleton';
import type { Carrera } from '../../../types';

export function MapFull() {
  const { profile } = useApp();
  const { ranked, loading } = useCarreras(profile);
  const navigate = useNavigate();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [hoverReg, setHoverReg] = useState<string | null>(null);

  if (loading) return <div className="state-center"><Skeleton variant="hero" /></div>;
  if (!ranked.length) return null;

  const current: Carrera = ranked.find((c) => c.slug === activeSlug) ?? ranked[0];
  const hls = Object.entries(current.demandaPorRegion).map(([regionId, v]) => ({
    regionId,
    intensity: (v as number) / 100,
    count: Math.round((v as number) / 10),
  }));

  return (
    <section>
      <div className="section-head" style={{ marginTop: 20 }}>
        <h2>Dónde está el trabajo<br />para cada carrera.</h2>
        <p className="section-lede">Interactivo. Hazle hover a una región para ver demanda; cambia la carrera a la derecha.</p>
      </div>

      <div className="match-map">
        <div>
          <ColombiaMap highlights={hls} activeRegion={hoverReg} onHover={setHoverReg} height={520} />
          <div style={{ padding: '12px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono pl">Demanda por región · {current.nombre}</span>
            <button type="button" className="btn sm" onClick={() => navigate(`/detalle/${current.slug}`)}>
              Ver detalle →
            </button>
          </div>
        </div>
        <div className="map-legend">
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 14 }}>Cambia la carrera</h4>
          {ranked.slice(0, 10).map((c) => (
            <div
              key={c.slug}
              className={`ml ${current.slug === c.slug ? 'is-active' : ''}`}
              onClick={() => setActiveSlug(c.slug)}
            >
              <span className="d" />
              <div>
                <div className="t">{c.nombre}</div>
                <div style={{ fontSize: 11, opacity: .7, marginTop: 2 }}>{c.tipo}</div>
              </div>
              <span className="n">{c.score}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
