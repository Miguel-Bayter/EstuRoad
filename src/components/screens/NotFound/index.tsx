import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="state-center" style={{ flexDirection: 'column', gap: 16, textAlign: 'center' }}>
      <span className="mono pl">404</span>
      <h2>Página no encontrada</h2>
      <p style={{ color: 'var(--ink-2)', maxWidth: '40ch' }}>
        La ruta que buscas no existe. Puede que la URL esté mal escrita.
      </p>
      <button type="button" className="btn" onClick={() => navigate('/')}>
        ← Volver al inicio
      </button>
    </div>
  );
}
