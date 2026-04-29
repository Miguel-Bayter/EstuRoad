import { useState, useMemo } from 'react';
import XLSX from 'xlsx-js-style';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { useCarreras } from '../../../hooks/useCarreras';
import { Skeleton } from '../../ui/Skeleton';
import { EmptyState } from '../../ui/EmptyState';
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

  function downloadXLSX() {
    const regionKey = profile.regionId as keyof (typeof carreras)[0]['demandaPorRegion'];

    const HEADER_STYLE = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
      fill: { fgColor: { rgb: '2D6A4F' } },
      alignment: { horizontal: 'center' as const, vertical: 'center' as const, wrapText: true },
      border: { bottom: { style: 'thin', color: { rgb: 'FFFFFF' } } },
    };
    const LABEL_STYLE = {
      font: { bold: true, sz: 10 },
      fill: { fgColor: { rgb: 'F5F1E8' } },
      alignment: { vertical: 'center' as const },
    };
    const CURRENCY_FMT = '"$"#,##0';
    const PCT_FMT = '0"%"';

    const str = (v: string, s?: object): XLSX.CellObject => ({
      t: 's',
      v,
      ...(s ? { s } : {}),
    });
    const num = (v: number, z?: string): XLSX.CellObject => ({
      t: 'n',
      v,
      ...(z ? { z } : {}),
    });

    const headerRow: XLSX.CellObject[] = [
      str('Criterio', HEADER_STYLE),
      ...carreras.map((c) => str(c.nombre, HEADER_STYLE)),
    ];

    const dataRows: XLSX.CellObject[][] = [
      [str('Match /100', LABEL_STYLE), ...carreras.map((c) => num(c.score ?? 0))],
      [str('Tipo', LABEL_STYLE), ...carreras.map((c) => str(c.tipo))],
      [str('Duración', LABEL_STYLE), ...carreras.map((c) => str(c.duracion))],
      [
        str('Salario entrada', LABEL_STYLE),
        ...carreras.map((c) => num(c.salarioEntrada, CURRENCY_FMT)),
      ],
      [
        str('Salario medio', LABEL_STYLE),
        ...carreras.map((c) => num(c.salarioMedio, CURRENCY_FMT)),
      ],
      [
        str('Salario senior', LABEL_STYLE),
        ...carreras.map((c) => num(c.salarioAlto, CURRENCY_FMT)),
      ],
      [
        str('Costo / semestre', LABEL_STYLE),
        ...carreras.map((c) =>
          c.costoSemestre === 0 ? str('Gratis') : num(c.costoSemestre, CURRENCY_FMT)
        ),
      ],
      [str('Empleabilidad', LABEL_STYLE), ...carreras.map((c) => num(c.empleabilidad, PCT_FMT))],
      [str('Demanda nacional', LABEL_STYLE), ...carreras.map((c) => str(c.demanda))],
      [str('Proyección 2030', LABEL_STYLE), ...carreras.map((c) => str(c.proyeccion2030))],
      [
        str(`Demanda en ${profile.ciudad}`, LABEL_STYLE),
        ...carreras.map((c) => num(c.demandaPorRegion[regionKey] ?? 50)),
      ],
      [str('ICETEX', LABEL_STYLE), ...carreras.map((c) => str(c.becasICETEX ? 'Sí' : 'No'))],
    ];

    const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);

    ws['!cols'] = [{ wch: 22 }, ...carreras.map(() => ({ wch: 26 }))];
    ws['!rows'] = [{ hpt: 36 }, ...dataRows.map(() => ({ hpt: 22 }))];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Comparación EstuRoad');
    XLSX.writeFile(wb, `esturoad-comparacion-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

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

  const carreras = ids.map((slug) => ranked.find((c) => c.slug === slug)!).filter(Boolean);

  const ROWS: { label: string; render: (c: Carrera) => React.ReactNode }[] = [
    {
      label: 'Match',
      render: (c) => (
        <span
          className={`compare-score ${(c.score ?? 0) > 80 ? 'compare-score--high' : (c.score ?? 0) > 65 ? 'compare-score--mid' : 'compare-score--low'}`}
        >
          {c.score}
        </span>
      ),
    },
    { label: 'Tipo', render: (c) => c.tipo },
    { label: 'Duración', render: (c) => c.duracion },
    {
      label: 'Salario entrada',
      render: (c) => <span className="compare-value--sm">{formatCOP(c.salarioEntrada)}</span>,
    },
    {
      label: 'Salario medio',
      render: (c) => <span className="compare-value--md">{formatCOP(c.salarioMedio)}</span>,
    },
    { label: 'Salario senior', render: (c) => formatCOP(c.salarioAlto) },
    {
      label: 'Costo / sem.',
      render: (c) => (c.costoSemestre === 0 ? 'Gratis' : formatCOP(c.costoSemestre)),
    },
    { label: 'Empleabilidad', render: (c) => `${c.empleabilidad}%` },
    { label: 'Demanda nacional', render: (c) => c.demanda },
    {
      label: 'Proyección 2030',
      render: (c) => <span className="compare-projection">{c.proyeccion2030}</span>,
    },
    {
      label: `Demanda en ${profile.ciudad}`,
      render: (c) =>
        `${c.demandaPorRegion[profile.regionId as keyof typeof c.demandaPorRegion] ?? 50}/100`,
    },
    { label: 'ICETEX', render: (c) => (c.becasICETEX ? 'Sí' : 'No') },
    {
      label: '¿Conviene quedarse?',
      render: (c) =>
        (c.demandaPorRegion[profile.regionId as keyof typeof c.demandaPorRegion] ?? 0) >= 75 ? (
          <span className="text-green">Sí, alta demanda local</span>
        ) : (
          <span className="text-terra">Mejor migrar</span>
        ),
    },
  ];

  return (
    <section>
      <div className="section-head section-head--mt">
        <h2>
          Tres caminos,
          <br />
          uno al lado del otro.
        </h2>
        <p className="section-lede">
          Compara match, costos, empleabilidad y oportunidad de quedarte vs. migrar.
        </p>
      </div>

      <div className="compare-controls">
        <span className="mono pl">Cambia una carrera:</span>
        {ids.map((id, i) => {
          const others = ids.filter((_, j) => j !== i);
          return (
            <select
              key={i}
              className="select sm"
              aria-label={`Carrera ${i + 1}`}
              value={id}
              onChange={(e) => swap(i, e.target.value)}
            >
              {ranked.map((r) => (
                <option key={r.slug} value={r.slug} disabled={others.includes(r.slug)}>
                  {r.nombre}
                </option>
              ))}
            </select>
          );
        })}
        <button type="button" className="btn sm ghost" onClick={downloadXLSX}>
          Descargar Excel
        </button>
      </div>

      <div className="compare-scroll">
        <div className="compare">
          <div className="compare-cell head">&nbsp;</div>
          {carreras.map((c) => (
            <div key={c.slug} className="compare-cell title">
              {c.nombre}
              <div className="sub">
                {c.tipo} · {c.duracion}
              </div>
            </div>
          ))}
          {ROWS.map((row) => (
            <>
              <div key={`lbl-${row.label}`} className="compare-cell head">
                {row.label}
              </div>
              {carreras.map((c) => (
                <div key={`${c.slug}-${row.label}`} className="compare-cell">
                  {row.render(c)}
                </div>
              ))}
            </>
          ))}
          <div className="compare-cell head">&nbsp;</div>
          {carreras.map((c) => (
            <div key={`cta-${c.slug}`} className="compare-cell">
              <button
                type="button"
                className="btn sm"
                onClick={() => navigate(`/detalle/${c.slug}`)}
              >
                Ver detalle →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
