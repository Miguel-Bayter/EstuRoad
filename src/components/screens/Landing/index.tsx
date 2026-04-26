import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div>
          <span className="hero-eyebrow">
            <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--green)', display: 'inline-block' }} />
            Plataforma en beta · Colombia 2026
          </span>
          <h1>
            Tu carrera,<br />
            <em>tu territorio.</em><br />
            Tu decisión.
          </h1>
          <p className="hero-sub">
            EstuRoad te ayuda a descubrir qué estudiar considerando de dónde vienes, qué te mueve y qué oportunidades reales tienes —quedándote o migrando— en Colombia.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn lime" onClick={() => navigate('/perfil')}>
              Empezar test gratuito →
            </button>
            <button type="button" className="btn ghost">Ver demo (2 min)</button>
          </div>
          <div className="hero-meta">
            <div>
              <div className="hero-meta-num"><em>340+</em></div>
              <div className="hero-meta-lbl">Carreras y rutas técnicas analizadas</div>
            </div>
            <div>
              <div className="hero-meta-num"><em>32</em></div>
              <div className="hero-meta-lbl">Departamentos con datos regionales</div>
            </div>
            <div>
              <div className="hero-meta-num"><em>8min</em></div>
              <div className="hero-meta-lbl">Test completo, resultados inmediatos</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hv-top">
            <span className="mono">colombia · 2026</span>
            <span className="mono">oportunidades · vivas</span>
          </div>
          <div className="hv-map">
            <div className="hv-dots">
              <div className="hv-pin" style={{ top: '18%', left: '48%' }} />
              <div className="hv-pin lime" style={{ top: '38%', left: '52%' }} />
              <div className="hv-pin green" style={{ top: '55%', left: '38%' }} />
              <div className="hv-pin" style={{ top: '42%', left: '72%' }} />
              <div className="hv-pin green" style={{ top: '28%', left: '58%' }} />
              <div className="hv-pin lime" style={{ top: '72%', left: '54%' }} />
              <div className="hv-pin line" style={{ top: '20%', left: '60%' }}>Barranquilla · +84</div>
              <div className="hv-pin line" style={{ top: '48%', left: '30%' }}>Cali · +62</div>
              <div className="hv-pin line" style={{ top: '62%', left: '64%' }}>Villao · +38</div>
            </div>
          </div>
          <div className="hv-bottom">
            <div className="hv-title">Quédate o muévete.<br />Tú decides, con datos.</div>
            <div className="hv-cap">Analizamos empleabilidad, salario y demanda en tu región vs. las grandes ciudades para que decidas con argumentos.</div>
          </div>
        </div>
      </section>

      <section className="strip">
        {['Contexto regional','Datos de empleabilidad','Test RIASEC adaptado','Universidades públicas y privadas','Becas ICETEX','Técnicas y tecnológicas','Quedarse o migrar'].map((t) => (
          <div key={t} className="strip-item">{t}</div>
        ))}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Un test vocacional<br />que entiende Colombia.</h2>
          <p className="section-lede">
            La mayoría de tests te dicen qué eres. EstuRoad además te dice dónde tiene sentido serlo, cuánto cuesta, y qué oportunidades hay sin que tengas que irte.
          </p>
        </div>
        <div className="why">
          <div className="why-card span-5 dark">
            <span className="mono" style={{ opacity: .6 }}>01 · Diferencial</span>
            <h3>Quedarte en tu ciudad<br />también es una opción.</h3>
            <p>Para cada carrera te mostramos oportunidades en tu región antes de asumir que tienes que migrar a Bogotá o Medellín.</p>
          </div>
          <div className="why-card span-4 lime">
            <span className="mono">02 · Contexto</span>
            <h3>Tu estrato<br />y presupuesto<br />importan.</h3>
            <p>Filtramos carreras viables según lo que tu familia puede pagar, incluyendo universidades públicas y ICETEX.</p>
          </div>
          <div className="why-card span-3 terra">
            <span className="mono">03</span>
            <div><div className="why-num">8 min</div><p>Test RIASEC adaptado al contexto colombiano.</p></div>
          </div>
          <div className="why-card span-4">
            <span className="mono">04</span>
            <h3>Salarios reales,<br />por región.</h3>
            <p>No es lo mismo ganar $5M en Bogotá que en Quibdó. Lo tenemos en cuenta.</p>
          </div>
          <div className="why-card span-4 green">
            <span className="mono" style={{ opacity: .7 }}>05</span>
            <h3>Técnicas y<br />tecnológicas<br />también cuentan.</h3>
            <p>Rutas cortas del SENA y politécnicos con salarios competitivos.</p>
          </div>
          <div className="why-card span-4">
            <span className="mono">06</span>
            <h3>Comparador<br />honesto.</h3>
            <p>Pon dos o tres carreras lado a lado: costo, duración, empleabilidad, sin filtros comerciales.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="card" style={{ background: 'var(--ink)', color: 'var(--paper)', border: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 30, alignItems: 'center' }}>
            <div>
              <span className="mono" style={{ opacity: .6 }}>Empieza ahora · gratis</span>
              <h2 style={{ fontSize: 'clamp(40px,5vw,72px)', marginTop: 14, fontStyle: 'italic' }}>
                ¿Vale la pena<br />quedarme o irme?
              </h2>
              <p style={{ marginTop: 14, maxWidth: '50ch', opacity: .75, fontSize: 16, lineHeight: 1.55 }}>
                Responde 20 preguntas y en 8 minutos tendrás un perfil con tus 5 mejores caminos, detalle por carrera, costos y un mapa de oportunidades en Colombia.
              </p>
              <div style={{ marginTop: 22, display: 'flex', gap: 12 }}>
                <button type="button" className="btn lime" onClick={() => navigate('/perfil')}>Hacer el test →</button>
                <button type="button" className="btn ghost" style={{ borderColor: 'var(--paper)', color: 'var(--paper)' }}>Soy orientador</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['1. Sobre ti', 'Ciudad, colegio, estrato, presupuesto'],
                ['2. Tus notas', 'Materias fuertes y Saber 11 (opcional)'],
                ['3. Qué te mueve', 'Intereses, habilidades, RIASEC'],
                ['4. Tus posibilidades', 'Disposición a mudarte, tiempo, prioridades'],
                ['5. Resultados', 'Tus 5 matches + mapa + detalle'],
              ].map(([title, sub], i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: 'rgba(245,241,232,.06)', borderRadius: 12 }}>
                  <strong style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, width: 26, color: 'var(--lime)' }}>0{i + 1}</strong>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{title}</div>
                    <div style={{ fontSize: 12, opacity: .65, marginTop: 2 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-2)' }}>
        <div>EstuRoad · demo de producto · datos ficticios con fines ilustrativos</div>
        <div style={{ display: 'flex', gap: 18 }}>
          {['Metodología','Privacidad','Para colegios','Contacto'].map((l) => <span key={l}>{l}</span>)}
        </div>
      </footer>
    </>
  );
}
