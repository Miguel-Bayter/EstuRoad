import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { useCarreras } from '../../../hooks/useCarreras';
import { Chip } from '../../ui/Chip';
import { Spark } from '../../ui/Spark';
import { ColombiaMap } from '../../ui/ColombiaMap';
import { Skeleton } from '../../ui/Skeleton';
import { EmptyState } from '../../ui/EmptyState';
import { RIASEC } from '../../../data/constants';
import { formatCOP } from '../../../utils/format';
import type { Carrera, Perfil } from '../../../types';

export function Results() {
  const { profile, viewChoice, isDemo, setIsDemo } = useApp();
  const { ranked, loading, error, warning, refetch } = useCarreras(profile);
  const [filter, setFilter] = useState<'todas' | 'univ' | 'tec' | 'locales' | string>('todas');
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="dash">
        <div className="dash-main">
          <Skeleton variant="hero" />
          <Skeleton variant="row" count={5} />
        </div>
      </div>
    );
  if (error)
    return (
      <div className="state-center">
        <EmptyState variant="error" onRetry={refetch} />
      </div>
    );
  if (!ranked.length)
    return (
      <div className="state-center">
        <EmptyState variant="sin-resultados" />
      </div>
    );

  const top = ranked[0];

  const filtered =
    filter === 'univ'
      ? ranked.filter((c) => c.tipo.startsWith('Univ'))
      : filter === 'tec'
        ? ranked.filter((c) => c.tipo.startsWith('Tec'))
        : filter === 'locales'
          ? ranked.filter(
              (c) =>
                (c.demandaPorRegion[profile.regionId as keyof typeof c.demandaPorRegion] ?? 0) >= 75
            )
          : filter.startsWith('region-')
            ? ranked.filter(
                (c) =>
                  (c.demandaPorRegion[
                    filter.replace('region-', '') as keyof typeof c.demandaPorRegion
                  ] ?? 0) >= 50
              )
            : ranked;

  return (
    <section>
      {isDemo && (
        <div className="demo-banner" role="note">
          <span>Estás viendo un perfil de demo · Los resultados son ilustrativos</span>
          <button
            type="button"
            className="btn sm lime"
            onClick={() => {
              setIsDemo(false);
              navigate('/perfil');
            }}
          >
            Completar mi perfil →
          </button>
        </div>
      )}
      {warning && (
        <div className="net-warning" role="alert">
          <span>⚠ {warning}</span>
          <button type="button" className="btn sm ghost" onClick={refetch}>
            Reintentar
          </button>
        </div>
      )}
      <div className="dash">
        <div className="dash-main">
          <DashHero top={top} navigate={navigate} />

          <div className="filter-row">
            <div className="chips" role="group" aria-label="Filtrar por tipo de carrera">
              {(
                [
                  ['todas', `Todas (${ranked.length})`],
                  ['univ', 'Universitarias'],
                  ['tec', 'Técnicas y tecnológicas'],
                  ['locales', `Con demanda en ${profile.ciudad}`],
                ] as const
              ).map(([v, label]) => (
                <Chip key={v} active={filter === v} onClick={() => setFilter(v)}>
                  {label}
                </Chip>
              ))}
            </div>
          </div>

          {viewChoice === 'list' && <MatchList items={filtered} navigate={navigate} />}
          {viewChoice === 'cards' && <MatchCards items={filtered} navigate={navigate} />}
          {viewChoice === 'map' && (
            <MapView
              ranked={filtered}
              navigate={navigate}
              onRegionSelect={(id: string) => setFilter(`region-${id}`)}
            />
          )}
        </div>

        <aside className="side-stack">
          <ProfileCard profile={profile} navigate={navigate} />
          <RiasecCard riasec={profile.riasec} />
          <DecisionCard profile={profile} />
          <DemandaCard regionId={profile.regionId} carreras={ranked} />
        </aside>
      </div>
    </section>
  );
}

// ---- Sub-components ----

function DashHero({ top, navigate }: { top: Carrera; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="dash-hero">
      <div className="dash-hero-content">
        <span className="mono paper-dim">Tu mejor match</span>
        <h3>
          {top.nombre.split(' ')[0]}
          <br />
          <em>{top.nombre.split(' ').slice(1).join(' ')}</em>
        </h3>
        <p className="dash-hero-desc">{top.resumen}</p>
        <div className="dash-hero-kpis">
          <div className="kpi">
            <div className="kpi-num">{top.score}/100</div>
            <div className="kpi-lbl">Match</div>
          </div>
          <div className="kpi">
            <div className="kpi-num">{formatCOP(top.salarioMedio)}</div>
            <div className="kpi-lbl">Salario medio</div>
          </div>
          <div className="kpi">
            <div className="kpi-num">{top.empleabilidad}%</div>
            <div className="kpi-lbl">Empleabilidad</div>
          </div>
        </div>
        <div className="dash-hero-actions">
          <button
            type="button"
            className="btn lime"
            onClick={() => navigate(`/detalle/${top.slug}`)}
          >
            Ver detalle completo →
          </button>
          <button type="button" className="btn ghost light" onClick={() => navigate('/comparar')}>
            Comparar con otras
          </button>
        </div>
      </div>
      <div className="dash-hero-right">
        {[
          ['Duración', top.duracion],
          ['Tipo', top.tipo],
          ['Costo/sem.', formatCOP(top.costoSemestre)],
          ['Demanda', top.demanda],
          ['Proyección 2030', top.proyeccion2030],
        ].map(([k, v]) => (
          <div key={k} className="k">
            <span>{k}</span>
            <span className={`v${k === 'Proyección 2030' ? ' v--lime' : ''}`}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchList({
  items,
  navigate,
}: {
  items: Carrera[];
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div className="match-list">
      {items.map((c) => (
        <div key={c.slug} className="match-row" onClick={() => navigate(`/detalle/${c.slug}`)}>
          <div className="match-score" style={{ '--v': c.score } as React.CSSProperties}>
            <span>{c.score}</span>
          </div>
          <div>
            <div className="match-title">{c.nombre}</div>
            <div className="match-sub">
              {c.tipo} · {c.duracion} · {c.demanda} demanda
            </div>
          </div>
          <div className="hide-sm">
            <div className="match-bar">
              {Array.from({ length: 10 }).map((_, k) => (
                <i key={k} className={k < Math.round(c.empleabilidad / 10) ? 'on' : ''} />
              ))}
            </div>
            <div className="match-tag match-tag--top">Empleabilidad {c.empleabilidad}%</div>
          </div>
          <div className="hide-sm">
            <div className="match-salary">{formatCOP(c.salarioMedio)}</div>
            <div className="match-tag">Salario medio</div>
          </div>
          <div className="match-arrow">→</div>
        </div>
      ))}
    </div>
  );
}

function MatchCards({
  items,
  navigate,
}: {
  items: Carrera[];
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div className="match-cards">
      {items.map((c, i) => (
        <div key={c.slug} className="match-card" onClick={() => navigate(`/detalle/${c.slug}`)}>
          <div className="rank">#{String(i + 1).padStart(2, '0')}</div>
          <div className="match-score" style={{ '--v': c.score } as React.CSSProperties}>
            <span>{c.score}</span>
          </div>
          <h4>{c.nombre}</h4>
          <p className="match-card-desc clamp-2">{c.resumen}</p>
          <div className="stats">
            <div>
              <div className="stat-lbl">Salario medio</div>
              <div className="stat-val">{formatCOP(c.salarioMedio)}</div>
            </div>
            <div>
              <div className="stat-lbl">Empleabilidad</div>
              <div className="stat-val">{c.empleabilidad}%</div>
            </div>
            <div>
              <div className="stat-lbl">Tipo</div>
              <div className="stat-val stat-val--tipo">{c.tipo}</div>
            </div>
            <div>
              <div className="stat-lbl">Proyección 2030</div>
              <div className="stat-val stat-val--projection">{c.proyeccion2030}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MapView({
  ranked,
  navigate,
  onRegionSelect,
}: {
  ranked: Carrera[];
  navigate: ReturnType<typeof useNavigate>;
  onRegionSelect: (id: string) => void;
}) {
  const [activeSlug, setActiveSlug] = useState(ranked[0]?.slug);
  const [hoverReg, setHoverReg] = useState<string | null>(null);
  const carrera: Carrera = ranked.find((c: Carrera) => c.slug === activeSlug) ?? ranked[0];
  const hls = Object.entries(carrera.demandaPorRegion).map(([regionId, v]) => ({
    regionId,
    intensity: (v as number) / 100,
    count: Math.round((v as number) / 10),
  }));

  return (
    <div className="match-map">
      <div>
        <ColombiaMap
          highlights={hls}
          activeRegion={hoverReg}
          onHover={setHoverReg}
          onSelect={onRegionSelect}
        />
        <div className="map-footer">
          <span className="mono pl">Demanda por región · {carrera.nombre}</span>
          <button
            type="button"
            className="btn sm"
            onClick={() => navigate(`/detalle/${carrera.slug}`)}
          >
            Ver detalle →
          </button>
        </div>
      </div>
      <div className="map-legend">
        <h4 className="map-legend-title">Cambia la carrera</h4>
        {ranked.slice(0, 8).map((c: Carrera) => (
          <div
            key={c.slug}
            className={`ml ${activeSlug === c.slug ? 'is-active' : ''}`}
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
      </div>
    </div>
  );
}

function ProfileCard({
  profile,
  navigate,
}: {
  profile: Perfil;
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div className="side-card">
      <h5>Tu perfil</h5>
      {[
        ['Ciudad', profile.ciudad],
        ['Estrato', profile.estrato],
        [
          'Presupuesto',
          profile.presupuesto === 0
            ? 'Solo pública'
            : `$${(profile.presupuesto / 1e6).toFixed(1)}M`,
        ],
        [
          'Moverse a',
          (profile.regionesDisponibles ?? []).length === 0
            ? 'Solo mi región'
            : `+${(profile.regionesDisponibles ?? []).length} región${(profile.regionesDisponibles ?? []).length > 1 ? 'es' : ''}`,
        ],
      ].map(([l, v]) => (
        <div key={String(l)} className="mini-kpi">
          <span className="l">{l}</span>
          <span className="v">{v}</span>
        </div>
      ))}
      <button type="button" className="btn sm ghost full" onClick={() => navigate('/perfil')}>
        Editar perfil
      </button>
    </div>
  );
}

function RiasecCard({ riasec }: { riasec: string[] }) {
  return (
    <div className="side-card">
      <h5>Tus perfiles RIASEC</h5>
      {riasec.map((k) => {
        const r = RIASEC.find((x) => x.k === k);
        return (
          <div key={k} className="bar">
            <span className="bar-lbl">{r?.titulo ?? k}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ '--bar-w': '82%' } as React.CSSProperties} />
            </div>
            <span className="bar-val">{k}</span>
          </div>
        );
      })}
    </div>
  );
}

function DecisionCard({ profile }: { profile: Perfil }) {
  const disponibles = profile.regionesDisponibles ?? [];
  const msg =
    disponibles.length === 0
      ? 'Te mostramos oportunidades en tu región primero.'
      : disponibles.length >= 3
        ? 'Exploramos opciones a nivel nacional.'
        : `Incluimos ${disponibles.length} región${disponibles.length > 1 ? 'es' : ''} adicional${disponibles.length > 1 ? 'es' : ''} en tu búsqueda.`;

  return (
    <div className="side-card green">
      <h5>Decisión clave</h5>
      <p className="decision-msg">{msg}</p>
      <div className="mono">Ajustado a {profile.ciudad}</div>
    </div>
  );
}

function buildDemandSeries(regionId: string, carreras: Carrera[]): number[] {
  const top5 = carreras.slice(0, 5);
  if (!top5.length) return [62, 65, 70, 72, 75, 80, 85, 92];

  const key = regionId as keyof (typeof top5)[0]['demandaPorRegion'];
  const base = Math.round(
    top5.reduce((s, c) => s + (c.demandaPorRegion[key] ?? 50), 0) / top5.length
  );

  const altas = top5.filter((c) => /alta/i.test(c.proyeccion2030)).length;
  const medias = top5.filter((c) => /media/i.test(c.proyeccion2030)).length;
  const rate = altas >= 3 ? 0.08 : medias >= 3 ? 0.04 : 0.025;

  return Array.from({ length: 8 }, (_, i) =>
    Math.min(100, Math.round(base * Math.pow(1 + rate, i)))
  );
}

function DemandaCard({ regionId, carreras }: { regionId: string; carreras: Carrera[] }) {
  const series = buildDemandSeries(regionId, carreras);
  return (
    <div className="side-card">
      <h5>Demanda en tu región</h5>
      <Spark values={series} color="var(--terra)" />
      <p className="spark-caption">
        Crecimiento proyectado de vacantes en {regionId} entre 2022–2030.
      </p>
    </div>
  );
}
