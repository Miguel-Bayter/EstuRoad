import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { useCarreras } from '../../../hooks/useCarreras';
import { ColombiaMap } from '../../ui/ColombiaMap';
import { Skeleton } from '../../ui/Skeleton';
import { EmptyState } from '../../ui/EmptyState';
import type { Carrera } from '../../../types';

export function MapFull() {
  const { profile } = useApp();
  const { ranked, loading } = useCarreras(profile);
  const navigate = useNavigate();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [hoverReg, setHoverReg] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  if (loading)
    return (
      <div className="state-center">
        <Skeleton variant="hero" />
      </div>
    );
  if (!ranked.length)
    return (
      <div className="state-center">
        <EmptyState variant="sin-resultados" />
      </div>
    );

  const current: Carrera = ranked.find((c) => c.slug === activeSlug) ?? ranked[0];
  const hls = Object.entries(current.demandaPorRegion).map(([regionId, v]) => ({
    regionId,
    intensity: (v as number) / 100,
    count: Math.round((v as number) / 10),
  }));

  return (
    <section>
      <div className="section-head section-head--mt">
        <h2>
          Dónde está el trabajo
          <br />
          para cada carrera.
        </h2>
        <p className="section-lede">
          Interactivo. Hazle hover a una región para ver demanda; cambia la carrera a la derecha.
        </p>
      </div>

      <div className="match-map">
        <div>
          <ColombiaMap
            highlights={hls}
            activeRegion={hoverReg ?? activeRegion}
            onHover={setHoverReg}
            onSelect={(id) => setActiveRegion((prev) => (prev === id ? null : id))}
            height={520}
          />
          <div className="map-footer">
            <span className="mono pl">
              {activeRegion
                ? `Top carreras en ${activeRegion} · clic para deseleccionar`
                : `Demanda por región · ${current.nombre}`}
            </span>
            {!activeRegion && (
              <button
                type="button"
                className="btn sm"
                onClick={() => navigate(`/detalle/${current.slug}`)}
              >
                Ver detalle →
              </button>
            )}
          </div>
        </div>
        <div className="map-legend">
          {activeRegion ? (
            <>
              <h4 className="map-legend-title">Top en {activeRegion}</h4>
              {[...ranked]
                .sort(
                  (a, b) =>
                    (b.demandaPorRegion[activeRegion as keyof typeof b.demandaPorRegion] ?? 0) -
                    (a.demandaPorRegion[activeRegion as keyof typeof a.demandaPorRegion] ?? 0)
                )
                .slice(0, 8)
                .map((c) => (
                  <div
                    key={c.slug}
                    className={`ml ${current.slug === c.slug ? 'is-active' : ''}`}
                    onClick={() => setActiveSlug(c.slug)}
                  >
                    <span className="d" />
                    <div>
                      <div className="t">{c.nombre}</div>
                      <div className="map-legend-sub">{c.tipo}</div>
                    </div>
                    <span className="n">
                      {c.demandaPorRegion[activeRegion as keyof typeof c.demandaPorRegion] ?? 0}
                    </span>
                  </div>
                ))}
            </>
          ) : (
            <>
              <h4 className="map-legend-title">Cambia la carrera</h4>
              {ranked.slice(0, 10).map((c) => (
                <div
                  key={c.slug}
                  className={`ml ${current.slug === c.slug ? 'is-active' : ''}`}
                  onClick={() => setActiveSlug(c.slug)}
                >
                  <span className="d" />
                  <div>
                    <div className="t">{c.nombre}</div>
                    <div className="map-legend-sub">{c.tipo}</div>
                  </div>
                  <span className="n">{c.score}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
