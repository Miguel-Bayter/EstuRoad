import { useNavigate } from 'react-router-dom';

interface StaticPage {
  title: string;
  content: React.ReactNode;
}

const PAGES: Record<string, StaticPage> = {
  metodologia: {
    title: 'Metodología',
    content: (
      <>
        <p className="section-lede">EstuRoad combina tres fuentes de datos para construir tu perfil de recomendación.</p>
        <div className="static-section">
          <h3>1. Test RIASEC adaptado</h3>
          <p>Usamos el modelo Holland (RIASEC) adaptado al contexto colombiano: 6 perfiles vocacionales (Realista, Investigativo, Artístico, Social, Emprendedor, Convencional) cruzados con las categorías de carreras del SNIES.</p>
        </div>
        <div className="static-section">
          <h3>2. Datos de empleabilidad OLE</h3>
          <p>Los salarios y tasas de empleo provienen del Observatorio Laboral para la Educación (OLE) del Ministerio de Educación. Actualizamos los datos anualmente.</p>
        </div>
        <div className="static-section">
          <h3>3. Scoring multicriterio</h3>
          <p>El score final pondera: match RIASEC (40%), demanda regional (25%), viabilidad presupuestal (20%) y proyección 2030 (15%). Los pesos se ajustan según tu disposición a mudarte.</p>
        </div>
        <div className="static-section">
          <h3>Limitaciones</h3>
          <p>Este es un MVP académico con datos ilustrativos. Los resultados son orientativos y no reemplazan el acompañamiento de un orientador profesional.</p>
        </div>
      </>
    ),
  },
  privacidad: {
    title: 'Privacidad',
    content: (
      <>
        <p className="section-lede">Tus datos son tuyos. Nunca los vendemos ni los compartimos sin tu permiso explícito.</p>
        <div className="static-section">
          <h3>¿Qué guardamos?</h3>
          <p>Solo el perfil que completaste en el test (ciudad, estrato, intereses, RIASEC). No pedimos nombre, correo ni documento de identidad.</p>
        </div>
        <div className="static-section">
          <h3>¿Cómo accedes a tu perfil?</h3>
          <p>Con tu código de 8 caracteres, generado aleatoriamente. Guárdalo si quieres recuperar tu sesión desde otro dispositivo.</p>
        </div>
        <div className="static-section">
          <h3>Cookies</h3>
          <p>Usamos una cookie de sesión httpOnly para autenticación. No usamos cookies de rastreo ni publicidad.</p>
        </div>
        <div className="static-section">
          <h3>Eliminación</h3>
          <p>Escríbenos a <span className="mono">hola@esturoad.co</span> con tu código y eliminamos tu perfil en 48 horas.</p>
        </div>
      </>
    ),
  },
  'para-colegios': {
    title: 'Para colegios',
    content: (
      <>
        <p className="section-lede">EstuRoad ofrece un panel de orientación para docentes y psicólogos escolares.</p>
        <div className="static-section">
          <h3>¿Qué incluye el panel?</h3>
          <p>Vista agregada de los resultados de tu curso: distribución RIASEC, carreras más elegidas, ciudades de interés y disposición a migrar — sin datos personales de los estudiantes.</p>
        </div>
        <div className="static-section">
          <h3>Cómo funciona</h3>
          <p>Compartes un código de grupo con tus estudiantes. Ellos completan el test y sus resultados (anonimizados) aparecen en tu dashboard.</p>
        </div>
        <div className="static-section">
          <h3>Precio</h3>
          <p>Gratuito durante la beta para colegios públicos. Escríbenos para activar tu acceso.</p>
        </div>
        <div className="static-section">
          <h3>Contacto</h3>
          <p>Escríbenos a <span className="mono">colegios@esturoad.co</span> y te respondemos en menos de 24 horas.</p>
        </div>
      </>
    ),
  },
  contacto: {
    title: 'Contacto',
    content: (
      <>
        <p className="section-lede">Estamos construyendo EstuRoad en público. Tu feedback nos importa.</p>
        <div className="static-section">
          <h3>Canal principal</h3>
          <p>Email: <span className="mono">hola@esturoad.co</span></p>
          <p>Respondemos en máximo 48 horas hábiles.</p>
        </div>
        <div className="static-section">
          <h3>¿Encontraste un error en los datos?</h3>
          <p>Escríbenos con el nombre de la carrera y la corrección. Los datos del OLE y SNIES se actualizan anualmente y agradecemos los reportes.</p>
        </div>
        <div className="static-section">
          <h3>¿Eres estudiante y quieres dar feedback?</h3>
          <p>Nos encantaría hablar contigo. Escríbenos con tu historia y te invitamos a una sesión de 30 minutos.</p>
        </div>
      </>
    ),
  },
};

export function StaticPage({ page }: { page: string }) {
  const navigate = useNavigate();
  const data = PAGES[page];

  if (!data) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <section className="static-page">
      <button type="button" className="btn sm ghost detail-back" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <div className="section-head section-head--mt">
        <h2>{data.title}</h2>
      </div>
      <div className="static-body">{data.content}</div>
    </section>
  );
}
