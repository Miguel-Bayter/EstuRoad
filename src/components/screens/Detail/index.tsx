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
  if (error || !carrera) return <div className="state-center"><p className="text-terra">Error al cargar carrera.</p></div>;

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
      <button type="button" className="btn sm ghost detail-back" onClick={() => navigate('/resultados')}>
        ← Volver a resultados
      </button>

      <div className="detail-hero">
        <div>
          <span className="mono paper-dim">{carrera.tipo} · {carrera.duracion}</span>
          <h1>
            {carrera.nombre.split(' ').slice(0, -1).join(' ')} <em>{carrera.nombre.split(' ').slice(-1)[0]}</em>
          </h1>
          <div className="meta">
            <span>Empleabilidad {carrera.empleabilidad}%</span>
            <span>{carrera.proyeccion2030} al 2030</span>
            <span>{carrera.becasICETEX ? 'ICETEX disponible' : 'Sin ICETEX'}</span>
          </div>
        </div>
        <div className="detail-score-wrap">
          <div className="mono paper-dim">Tu match</div>
          <div className="big-score">{score}<small>/100</small></div>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-main">
          <div className="panel">
            <h4>¿De qué va?</h4>
            <h3>{carrera.resumen}</h3>
          </div>

          <div className="panel">
            <h4>Lo que más importa · Tu decisión</h4>
            <h3>¿Te quedas o te mueves?</h3>
            <div className="split">
              <div className="split-col stay">
                <span className="mono paper-dim-7">Quédate en {profile.ciudad}</span>
                <h5>Oportunidades <em>locales</em></h5>
                <p>{carrera.stayVsLeave.stay}</p>
                <div className="split-col-stat">
                  <span className="mono paper-dim-7">Demanda local</span>
                  <span className="split-col-stat-value">{demandaLocal}/100</span>
                </div>
              </div>
              <div className="split-col leave">
                <span className="mono text-terra">Múdate a capital</span>
                <h5>Oportunidades <em>nacionales</em></h5>
                <p>{carrera.stayVsLeave.leave}</p>
                <div className="split-col-stat">
                  <span className="mono">Salario capital</span>
                  <span className="split-col-stat-value">{formatCOP(carrera.salarioAlto)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <h4>Salario a lo largo de la carrera</h4>
            <h3 className="salary-title">
              De <em className="salary-em-low">{formatCOP(carrera.salarioEntrada)}</em> a{' '}
              <em className="salary-em-high">{formatCOP(carrera.salarioAlto)}</em>
            </h3>
            <div className="spark-wrap"><Spark values={salaryData} color="var(--green)" /></div>
            <div className="salary-grid">
              {([['Entrada (junior)', carrera.salarioEntrada], ['Mid (3-5 años)', carrera.salarioMedio], ['Senior (10+ años)', carrera.salarioAlto]] as const).map(([l, v]) => (
                <div key={l}><div className="mono pl">{l}</div><div className="salary-stat-value">{formatCOP(v)}</div></div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h4>Dónde estudiar · Top universidades</h4>
            <h3>{carrera.universidades.length} opciones principales</h3>
            <div className="uni-list">
              {carrera.universidades.map((u, i) => (
                <div key={i} className="uni-row">
                  <div className="uni-rank">#{u.ranking}</div>
                  <div><div className="uni-name">{u.nombre}</div><div className="mono pl uni-city">{u.ciudad} · {u.publica ? 'Pública' : 'Privada'}</div></div>
                  <div className="uni-cost">{u.costoSem === 0 ? 'Gratis' : formatCOP(u.costoSem)}</div>
                  <span className={`chip no-pointer${u.publica ? ' green is-active' : ''}`}>{u.publica ? 'Pública' : 'Privada'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="detail-aside">
          <div className="panel">
            <h4>Un perfil como tú</h4>
            <p className="testimonial-quote">
              "Estaba segura de irme a Bogotá, pero EstuRoad me mostró que en Barranquilla tenía 3 ofertas cerca. Me ahorré $1M en arriendo."
            </p>
            <p className="mono pl testimonial-attr">— Laura M., 19 años, Barranquilla</p>
          </div>

          <div className="panel">
            <h4>Demanda por región</h4>
            {Object.entries(carrera.demandaPorRegion).map(([reg, v]) => {
              const isMine = reg === profile.regionId;
              return (
                <div key={reg} className={`bar${isMine ? ' bar--mine' : ''}`}>
                  <span className="bar-lbl">{reg}{isMine && ' ←'}</span>
                  <div className="bar-track"><div className="bar-fill" style={{ '--bar-w': `${v}%`, '--bar-bg': isMine ? 'var(--terra)' : 'var(--green)' } as React.CSSProperties} /></div>
                  <span className="bar-val">{v}</span>
                </div>
              );
            })}
          </div>

          <div className="panel dark">
            <h4>Checklist de realidad</h4>
            <ul className="checklist">
              <li>✓ Tu presupuesto alcanza para {carrera.universidades.filter((u) => u.costoSem <= profile.presupuesto).length}/{carrera.universidades.length} opciones</li>
              <li>✓ Duración: {carrera.duracion}</li>
              <li>✓ {carrera.becasICETEX ? 'Hay becas y crédito ICETEX' : 'No aplica ICETEX'}</li>
              <li>✓ {carrera.regionesDemanda.length} regiones con demanda alta</li>
            </ul>
            <button type="button" className="btn lime full">
              Guardar en mis favoritos
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
