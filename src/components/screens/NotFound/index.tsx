import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="state-center">
      <span className="mono pl">404</span>
      <h2>Página no encontrada</h2>
      <p>
        La ruta que buscas no existe. Puede que la URL esté mal escrita.
      </p>
      <button type="button" className="btn" onClick={() => navigate('/')}>
        ← Volver al inicio
      </button>
    </div>
  );
}
