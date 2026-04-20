import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { useCarreras } from '../../../hooks/useCarreras';
import { Chip } from '../../ui/Chip';
import { Spark } from '../../ui/Spark';
import { ColombiaMap } from '../../ui/ColombiaMap';
import { RIASEC } from '../../../data/constants';
import { formatCOP } from '../../../utils/format';
import type { Carrera } from '../../../types';

export function Results() {
  const { profile, setScreen, setDetailSlug, viewChoice } = useApp();
  const { ranked, loading, error } = useCarreras(profile);
  const [filter, setFilter] = useState<'todas' | 'univ' | 'tec' | 'locales'>('todas');

  if (loading) return <div className="state-center"><div className="spinner" /><p>Cargando carreras…</p></div>;
  if (error) return <div className="state-center"><p style={{ color: 'var(--terra)' }}>Error: {error}</p></div>;
  if (!ranked.length) return null;

  const top = ranked[0];

  const filtered =
    filter === 'univ' ? ranked.filter((c) => c.tipo.startsWith('Univ')) :
    filter === 'tec'  ? ranked.filter((c) => c.tipo.startsWith('Tec')) :
    filter === 'locales' ? ranked.filter((c) => (c.demandaPorRegion[profile.regionId as keyof typeof c.demandaPorRegion] ?? 0) >= 75) :
    ranked;

  return (
    <section>
      <div className="dash">
        <div className="dash-main">
          <DashHero top={top} setScreen={setScreen} setDetailSlug={setDetailSlug} />

          <div className="filter-row">
            <div className="chips" style={{ flex: 1 }}>
              {([
                ['todas', `Todas (${ranked.length})`],
                ['univ', 'Universitarias'],
                ['tec', 'Técnicas y tecnológicas'],
                ['locales', `Con demanda en ${profile.ciudad}`],
              ] as const).map(([v, label]) => (
                <Chip key={v} active={filter === v} onClick={() => setFilter(v)}>{label}</Chip>
              ))}
            </div>
          </div>

          {viewChoice === 'list' && <MatchList items={filtered} setScreen={setScreen} setDetailSlug={setDetailSlug} />}
          {viewChoice === 'cards' && <MatchCards items={filtered} setScreen={setScreen} setDetailSlug={setDetailSlug} />}
          {viewChoice === 'map' && <MapView ranked={filtered} profile={profile} setScreen={setScreen} setDetailSlug={setDetailSlug} />}
        </div>

        <aside className="side-stack">
          <ProfileCard profile={profile} setScreen={setScreen} />
          <RiasecCard riasec={profile.riasec} />
          <DecisionCard profile={profile} />
          <DemandaCard regionId={profile.regionId} />
        </aside>
      </div>
    </section>
  );
}

// ---- Sub-components ----

function DashHero({ top, setScreen, setDetailSlug }: { top: Carrera; setScreen: (s: any) => void; setDetailSlug: (s: string) => void }) {
  return (
    <div className="dash-hero">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <span className="mono" style={{ color: 'rgba(245,241,232,.6)' }}>Tu mejor match</span>
        <h3 style={{ marginTop: 10 }}>
          {top.nombre.split(' ')[0]}<br />
          <em>{top.nombre.split(' ').slice(1).join(' ')}</em>
        </h3>
        <p style={{ marginTop: 12, opacity: .75, maxWidth: '46ch', fontSize: 14, lineHeight: 1.5 }}>{top.resumen}</p>
        <div className="dash-hero-kpis">
          <div className="kpi"><div className="kpi-num">{top.score}/100</div><div className="kpi-lbl">Match</div></div>
          <div className="kpi"><div className="kpi-num">{formatCOP(top.salarioMedio)}</div><div className="kpi-lbl">Salario medio</div></div>
          <div className="kpi"><div className="kpi-num">{top.empleabilidad}%</div><div className="kpi-lbl">Empleabilidad</div></div>
        </div>
        <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
          <button type="button" className="btn lime" onClick={() => { setDetailSlug(top.slug); setScreen('detail'); }}>
            Ver detalle completo →
          </button>
          <button type="button" className="btn ghost" style={{ color: 'var(--paper)', borderColor: 'var(--paper)' }} onClick={() => setScreen('compare')}>
            Comparar con otras
          </button>
        </div>
      </div>
      <div className="dash-hero-right">
        {[['Duración', top.duracion], ['Tipo', top.tipo], ['Costo/sem.', formatCOP(top.costoSemestre)], ['Demanda', top.demanda], ['Proyección 2030', top.proyeccion2030]].map(([k, v]) => (
          <div key={k} className="k"><span>{k}</span><span className="v" style={k === 'Proyección 2030' ? { color: 'var(--lime)' } : {}}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

function MatchList({ items, setScreen, setDetailSlug }: { items: Carrera[]; setScreen: (s: any) => void; setDetailSlug: (s: string) => void }) {
  return (
    <div className="match-list">
      {items.map((c) => (
        <div key={c.slug} className="match-row" onClick={() => { setDetailSlug(c.slug); setScreen('detail'); }}>
          <div className="match-score" style={{ '--v': c.score } as React.CSSProperties}><span>{c.score}</span></div>
          <div>
            <div className="match-title">{c.nombre}</div>
            <div className="match-sub">{c.tipo} · {c.duracion} · {c.demanda} demanda</div>
          </div>
          <div className="hide-sm">
            <div className="match-bar">
              {Array.from({ length: 10 }).map((_, k) => (
                <i key={k} className={k < Math.round(c.empleabilidad / 10) ? 'on' : ''} />
              ))}
            </div>
            <div className="match-tag" style={{ marginTop: 6 }}>Empleabilidad {c.empleabilidad}%</div>
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

function MatchCards({ items, setScreen, setDetailSlug }: { items: Carrera[]; setScreen: (s: any) => void; setDetailSlug: (s: string) => void }) {
  return (
    <div className="match-cards">
      {items.map((c, i) => (
        <div key={c.slug} className="match-card" onClick={() => { setDetailSlug(c.slug); setScreen('detail'); }}>
          <div className="rank">#{String(i + 1).padStart(2, '0')}</div>
          <div className="match-score" style={{ '--v': c.score, width: 52, height: 52 } as React.CSSProperties}><span>{c.score}</span></div>
          <h4>{c.nombre}</h4>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.45, margin: 0 }} className="clamp-2">{c.resumen}</p>
          <div className="stats">
            <div><div className="stat-lbl">Salario medio</div><div className="stat-val">{formatCOP(c.salarioMedio)}</div></div>
            <div><div className="stat-lbl">Empleabilidad</div><div className="stat-val">{c.empleabilidad}%</div></div>
            <div><div className="stat-lbl">Tipo</div><div className="stat-val" style={{ fontSize: 14, fontStyle: 'normal', fontFamily: 'var(--font-ui)', fontWeight: 600 }}>{c.tipo}</div></div>
            <div><div className="stat-lbl">Proyección 2030</div><div className="stat-val" style={{ fontSize: 16, color: 'var(--green-deep)' }}>{c.proyeccion2030}</div></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MapView({ ranked, profile, setScreen, setDetailSlug }: any) {
  const [activeSlug, setActiveSlug] = useState(ranked[0]?.slug);
  const [hoverReg, setHoverReg] = useState<string | null>(null);
  const carrera: Carrera = ranked.find((c: Carrera) => c.slug === activeSlug) ?? ranked[0];
  const hls = Object.entries(carrera.demandaPorRegion).map(([regionId, v]) => ({
    regionId, intensity: (v as number) / 100, count: Math.round((v as number) / 10),
  }));

  return (
    <div className="match-map">
      <div>
        <ColombiaMap highlights={hls} activeRegion={hoverReg} onHover={setHoverReg} />
        <div style={{ padding: '12px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="mono pl">Demanda por región · {carrera.nombre}</span>
          <button type="button" className="btn sm" onClick={() => { setDetailSlug(carrera.slug); setScreen('detail'); }}>Ver detalle →</button>
        </div>
      </div>
      <div className="map-legend">
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 14 }}>Cambia la carrera</h4>
        {ranked.slice(0, 8).map((c: Carrera) => (
          <div key={c.slug} className={`ml ${activeSlug === c.slug ? 'is-active' : ''}`} onClick={() => setActiveSlug(c.slug)}>
            <span className="d" />
            <div><div className="t">{c.nombre}</div><div style={{ fontSize: 11, opacity: .7, marginTop: 2 }}>{c.tipo}</div></div>
            <span className="n">{c.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileCard({ profile, setScreen }: any) {
  return (
    <div className="side-card">
      <h5>Tu perfil</h5>
      {[['Ciudad', profile.ciudad], ['Estrato', profile.estrato], ['Presupuesto', profile.presupuesto === 0 ? 'Solo pública' : `$${(profile.presupuesto / 1e6).toFixed(1)}M`], ['Mudarse', `${profile.mudarse}%`]].map(([l, v]) => (
        <div key={String(l)} className="mini-kpi"><span className="l">{l}</span><span className="v">{v}</span></div>
      ))}
      <button type="button" className="btn sm ghost" style={{ marginTop: 10, width: '100%', justifyContent: 'center' }} onClick={() => setScreen('onboarding')}>Editar perfil</button>
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
            <span className="bar-lbl" style={{ fontWeight: 500 }}>{r?.titulo ?? k}</span>
            <div className="bar-track"><div className="bar-fill" style={{ width: '82%' }} /></div>
            <span className="bar-val">{k}</span>
          </div>
        );
      })}
    </div>
  );
}

function DecisionCard({ profile }: any) {
  const msg = profile.mudarse < 40
    ? 'Te mostramos oportunidades locales primero.'
    : profile.mudarse > 65
    ? 'Exploramos opciones a nivel nacional.'
    : 'Balance entre quedarte y migrar.';

  return (
    <div className="side-card" style={{ background: 'var(--green)', color: 'var(--paper)', borderColor: 'var(--green-deep)' }}>
      <h5 style={{ color: 'rgba(245,241,232,.7)' }}>Decisión clave</h5>
      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 24, lineHeight: 1.1, margin: '6px 0 10px' }}>{msg}</p>
      <div className="mono" style={{ opacity: .8 }}>Ajustado a {profile.ciudad}</div>
    </div>
  );
}

function DemandaCard({ regionId }: { regionId: string }) {
  return (
    <div className="side-card">
      <h5>Demanda en tu región</h5>
      <Spark values={[62,65,70,72,75,80,85,92]} color="var(--terra)" />
      <p style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 6 }}>
        Crecimiento proyectado de vacantes en {regionId} entre 2022–2030.
      </p>
    </div>
  );
}
