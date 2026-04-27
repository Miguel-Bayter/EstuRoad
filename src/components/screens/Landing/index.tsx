import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div>
          <span className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
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
              <div className="hv-pin" style={{ '--pin-top': '18%', '--pin-left': '48%' } as React.CSSProperties} />
              <div className="hv-pin lime" style={{ '--pin-top': '38%', '--pin-left': '52%' } as React.CSSProperties} />
              <div className="hv-pin green" style={{ '--pin-top': '55%', '--pin-left': '38%' } as React.CSSProperties} />
              <div className="hv-pin" style={{ '--pin-top': '42%', '--pin-left': '72%' } as React.CSSProperties} />
              <div className="hv-pin green" style={{ '--pin-top': '28%', '--pin-left': '58%' } as React.CSSProperties} />
              <div className="hv-pin lime" style={{ '--pin-top': '72%', '--pin-left': '54%' } as React.CSSProperties} />
              <div className="hv-pin line" style={{ '--pin-top': '20%', '--pin-left': '60%' } as React.CSSProperties}>Barranquilla · +84</div>
              <div className="hv-pin line" style={{ '--pin-top': '48%', '--pin-left': '30%' } as React.CSSProperties}>Cali · +62</div>
              <div className="hv-pin line" style={{ '--pin-top': '62%', '--pin-left': '64%' } as React.CSSProperties}>Villao · +38</div>
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
            <span className="mono dim">01 · Diferencial</span>
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
            <span className="mono dim-7">05</span>
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
        <div className="card dark">
          <div className="cta-grid">
            <div>
              <span className="mono dim">Empieza ahora · gratis</span>
              <h2 className="cta-h2">
                ¿Vale la pena<br />quedarme o irme?
              </h2>
              <p className="cta-body">
                Responde 20 preguntas y en 8 minutos tendrás un perfil con tus 5 mejores caminos, detalle por carrera, costos y un mapa de oportunidades en Colombia.
              </p>
              <div className="cta-actions">
                <button type="button" className="btn lime" onClick={() => navigate('/perfil')}>Hacer el test →</button>
                <button type="button" className="btn ghost light">Soy orientador</button>
              </div>
            </div>
            <div className="cta-steps">
              {[
                ['1. Sobre ti', 'Ciudad, colegio, estrato, presupuesto'],
                ['2. Tus notas', 'Materias fuertes y Saber 11 (opcional)'],
                ['3. Qué te mueve', 'Intereses, habilidades, RIASEC'],
                ['4. Tus posibilidades', 'Disposición a mudarte, tiempo, prioridades'],
                ['5. Resultados', 'Tus 5 matches + mapa + detalle'],
              ].map(([title, sub], i) => (
                <div key={i} className="step-item">
                  <strong className="step-item-num">0{i + 1}</strong>
                  <div>
                    <div className="step-item-title">{title}</div>
                    <div className="step-item-sub">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div>EstuRoad · demo de producto · datos ficticios con fines ilustrativos</div>
        <div className="site-footer-links">
          {['Metodología','Privacidad','Para colegios','Contacto'].map((l) => <span key={l}>{l}</span>)}
        </div>
      </footer>
    </>
  );
}
