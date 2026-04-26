import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { useCarreras } from '../../../hooks/useCarreras';
import { Skeleton } from '../../ui/Skeleton';
import { formatCOP } from '../../../utils/format';
import type { Carrera } from '../../../types';

export function Compare() {
  const { profile } = useApp();
  const { ranked, loading } = useCarreras(profile);
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const initialSelected = useMemo(() => ranked.slice(0, 3).map((c) => c.slug), [ranked]);
  const ids = selected.length === 3 ? selected : initialSelected;

  function swap(idx: number, newSlug: string) {
    const base = ids.slice();
    base[idx] = newSlug;
    setSelected(base);
  }

  if (loading) return <div className="state-center"><Skeleton variant="hero" /></div>;
  if (!ranked.length) return null;

  const carreras = ids.map((slug) => ranked.find((c) => c.slug === slug)!).filter(Boolean);

  const ROWS: { label: string; render: (c: Carrera) => React.ReactNode }[] = [
    { label: 'Match', render: (c) => <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28, color: (c.score ?? 0) > 80 ? 'var(--green-deep)' : (c.score ?? 0) > 65 ? 'var(--terra-deep)' : 'var(--ink-2)' }}>{c.score}</span> },
    { label: 'Tipo', render: (c) => c.tipo },
    { label: 'Duración', render: (c) => c.duracion },
    { label: 'Salario entrada', render: (c) => <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22 }}>{formatCOP(c.salarioEntrada)}</span> },
    { label: 'Salario medio', render: (c) => <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 24 }}>{formatCOP(c.salarioMedio)}</span> },
    { label: 'Salario senior', render: (c) => formatCOP(c.salarioAlto) },
    { label: 'Costo / sem.', render: (c) => c.costoSemestre === 0 ? 'Gratis' : formatCOP(c.costoSemestre) },
    { label: 'Empleabilidad', render: (c) => `${c.empleabilidad}%` },
    { label: 'Demanda nacional', render: (c) => c.demanda },
    { label: 'Proyección 2030', render: (c) => <span style={{ color: 'var(--green-deep)', fontWeight: 600 }}>{c.proyeccion2030}</span> },
    { label: `Demanda en ${profile.ciudad}`, render: (c) => `${c.demandaPorRegion[profile.regionId as keyof typeof c.demandaPorRegion] ?? 50}/100` },
    { label: 'ICETEX', render: (c) => c.becasICETEX ? 'Sí' : 'No' },
    { label: '¿Conviene quedarse?', render: (c) => (c.demandaPorRegion[profile.regionId as keyof typeof c.demandaPorRegion] ?? 0) >= 75 ? <span style={{ color: 'var(--green-deep)' }}>Sí, alta demanda local</span> : <span style={{ color: 'var(--terra-deep)' }}>Mejor migrar</span> },
  ];

  return (
    <section>
      <div className="section-head" style={{ marginTop: 20 }}>
        <h2>Tres caminos,<br />uno al lado del otro.</h2>
        <p className="section-lede">Compara match, costos, empleabilidad y oportunidad de quedarte vs. migrar.</p>
      </div>

      <div style={{ display: 'flex', gap: 10, margin: '20px 0 14px', alignItems: 'center' }}>
        <span className="mono pl">Cambia una carrera:</span>
        {ids.map((id, i) => (
          <select key={i} className="select" style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }} value={id} onChange={(e) => swap(i, e.target.value)}>
            {ranked.map((r) => <option key={r.slug} value={r.slug}>{r.nombre}</option>)}
          </select>
        ))}
      </div>

      <div className="compare">
        <div className="compare-cell head">&nbsp;</div>
        {carreras.map((c) => (
          <div key={c.slug} className="compare-cell title">
            {c.nombre}
            <div className="sub">{c.tipo} · {c.duracion}</div>
          </div>
        ))}
        {ROWS.map((row) => (
          <>
            <div key={`lbl-${row.label}`} className="compare-cell head">{row.label}</div>
            {carreras.map((c) => (
              <div key={`${c.slug}-${row.label}`} className="compare-cell">{row.render(c)}</div>
            ))}
          </>
        ))}
        <div className="compare-cell head">&nbsp;</div>
        {carreras.map((c) => (
          <div key={`cta-${c.slug}`} className="compare-cell">
            <button type="button" className="btn sm" onClick={() => navigate(`/detalle/${c.slug}`)}>Ver detalle →</button>
          </div>
        ))}
      </div>
    </section>
  );
}
