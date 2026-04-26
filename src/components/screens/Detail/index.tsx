import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { Spark } from '../../ui/Spark';
import { Skeleton } from '../../ui/Skeleton';
import { carrerasApi } from '../../../api';
import { scoreCarrera } from '../../../utils/scoring';
import { formatCOP } from '../../../utils/format';
import type { Carrera } from '../../../types';

export function Detail() {
  const { slug } = useParams<{ slug: string }>();
  const { profile } = useApp();
  const navigate = useNavigate();
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    carrerasApi.get(slug)
      .then(setCarrera)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="state-center"><Skeleton variant="hero" /></div>;
  if (error || !carrera) return <div className="state-center"><p style={{ color: 'var(--terra)' }}>Error al cargar carrera.</p></div>;

  const score = scoreCarrera(carrera, profile);
  const salaryData = [
    carrera.salarioEntrada,
    carrera.salarioEntrada * 1.2,
    carrera.salarioEntrada * 1.5,
    carrera.salarioMedio * 0.9,
    carrera.salarioMedio,
    carrera.salarioMedio * 1.3,
    carrera.salarioAlto * 0.8,
    carrera.salarioAlto,
  ];
  const demandaLocal = carrera.demandaPorRegion[profile.regionId as keyof typeof carrera.demandaPorRegion] ?? 50;

  return (
    <section>
      <button type="button" className="btn sm ghost" onClick={() => navigate('/resultados')} style={{ marginBottom: 14 }}>
        ← Volver a resultados
      </button>

      <div className="detail-hero">
        <div>
          <span className="mono" style={{ color: 'rgba(245,241,232,.6)' }}>{carrera.tipo} · {carrera.duracion}</span>
          <h1 style={{ marginTop: 8 }}>
            {carrera.nombre.split(' ').slice(0, -1).join(' ')} <em>{carrera.nombre.split(' ').slice(-1)[0]}</em>
          </h1>
          <div className="meta">
            <span>Empleabilidad {carrera.empleabilidad}%</span>
            <span>{carrera.proyeccion2030} al 2030</span>
            <span>{carrera.becasICETEX ? 'ICETEX disponible' : 'Sin ICETEX'}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono" style={{ color: 'rgba(245,241,232,.6)' }}>Tu match</div>
          <div className="big-score">{score}<small>/100</small></div>
        </div>
      </div>

      <div className="detail-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="panel">
            <h4>¿De qué va?</h4>
            <h3>{carrera.resumen}</h3>
          </div>

          <div className="panel">
            <h4>Lo que más importa · Tu decisión</h4>
            <h3 style={{ marginBottom: 16 }}>¿Te quedas o te mueves?</h3>
            <div className="split">
              <div className="split-col stay">
                <span className="mono" style={{ color: 'rgba(245,241,232,.7)' }}>Quédate en {profile.ciudad}</span>
                <h5>Oportunidades <em>locales</em></h5>
                <p>{carrera.stayVsLeave.stay}</p>
                <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(245,241,232,.1)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono" style={{ color: 'rgba(245,241,232,.8)' }}>Demanda local</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22 }}>{demandaLocal}/100</span>
                </div>
              </div>
              <div className="split-col leave">
                <span className="mono" style={{ color: 'var(--terra-deep)' }}>Múdate a capital</span>
                <h5>Oportunidades <em>nacionales</em></h5>
                <p>{carrera.stayVsLeave.leave}</p>
                <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(255,255,255,.4)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono">Salario capital</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22 }}>{formatCOP(carrera.salarioAlto)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <h4>Salario a lo largo de la carrera</h4>
            <h3 style={{ marginBottom: 8 }}>
              De <em style={{ fontStyle: 'italic', color: 'var(--terra-deep)' }}>{formatCOP(carrera.salarioEntrada)}</em> a{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--green-deep)' }}>{formatCOP(carrera.salarioAlto)}</em>
            </h3>
            <div style={{ height: 140 }}><Spark values={salaryData} color="var(--green)" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginTop: 16, paddingTop: 16, borderTop: '1px dashed var(--line)' }}>
              {([['Entrada (junior)', carrera.salarioEntrada], ['Mid (3-5 años)', carrera.salarioMedio], ['Senior (10+ años)', carrera.salarioAlto]] as const).map(([l, v]) => (
                <div key={l}><div className="mono pl">{l}</div><div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28, marginTop: 4 }}>{formatCOP(v)}</div></div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h4>Dónde estudiar · Top universidades</h4>
            <h3 style={{ marginBottom: 16 }}>{carrera.universidades.length} opciones principales</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {carrera.universidades.map((u, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto auto', gap: 14, alignItems: 'center', padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 12, background: 'var(--paper-2)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 24, color: 'var(--terra-deep)' }}>#{u.ranking}</div>
                  <div><div style={{ fontWeight: 500 }}>{u.nombre}</div><div className="mono pl" style={{ marginTop: 3 }}>{u.ciudad} · {u.publica ? 'Pública' : 'Privada'}</div></div>
                  <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20 }}>{u.costoSem === 0 ? 'Gratis' : formatCOP(u.costoSem)}</div>
                  <span className={`chip ${u.publica ? 'green is-active' : ''}`} style={{ pointerEvents: 'none' }}>{u.publica ? 'Pública' : 'Privada'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="panel">
            <h4>Un perfil como tú</h4>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, lineHeight: 1.2 }}>
              "Estaba segura de irme a Bogotá, pero EstuRoad me mostró que en Barranquilla tenía 3 ofertas cerca. Me ahorré $1M en arriendo."
            </p>
            <p className="mono pl" style={{ marginTop: 10 }}>— Laura M., 19 años, Barranquilla</p>
          </div>

          <div className="panel">
            <h4>Demanda por región</h4>
            {Object.entries(carrera.demandaPorRegion).map(([reg, v]) => {
              const isMine = reg === profile.regionId;
              return (
                <div key={reg} className="bar">
                  <span className="bar-lbl" style={{ fontWeight: isMine ? 600 : 400 }}>{reg}{isMine && ' ←'}</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${v}%`, background: isMine ? 'var(--terra)' : 'var(--green)' }} /></div>
                  <span className="bar-val">{v}</span>
                </div>
              );
            })}
          </div>

          <div className="panel" style={{ background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }}>
            <h4 style={{ color: 'rgba(245,241,232,.6)' }}>Checklist de realidad</h4>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <li>✓ Tu presupuesto alcanza para {carrera.universidades.filter((u) => u.costoSem <= profile.presupuesto).length}/{carrera.universidades.length} opciones</li>
              <li>✓ Duración: {carrera.duracion}</li>
              <li>✓ {carrera.becasICETEX ? 'Hay becas y crédito ICETEX' : 'No aplica ICETEX'}</li>
              <li>✓ {carrera.regionesDemanda.length} regiones con demanda alta</li>
            </ul>
            <button type="button" className="btn lime" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
              Guardar en mis favoritos
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
