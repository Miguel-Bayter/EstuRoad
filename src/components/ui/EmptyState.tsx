import { useNavigate } from 'react-router-dom';

type EmptyVariant = 'sin-resultados' | 'sin-favoritos' | 'error';

interface EmptyStateProps {
  variant: EmptyVariant;
  onRetry?: () => void;
}

const CONFIG: Record<EmptyVariant, { icon: string; title: string; body: string; cta?: string }> = {
  'sin-resultados': {
    icon: '🔍',
    title: 'Sin resultados con ese filtro',
    body: 'Prueba con "Todas" o ajusta tu perfil para ver más opciones.',
    cta: 'Ver todas las carreras',
  },
  'sin-favoritos': {
    icon: '⭐',
    title: 'Aún no tienes favoritos',
    body: 'Explora el detalle de una carrera y guárdala aquí.',
    cta: 'Ver resultados',
  },
  error: {
    icon: '⚠️',
    title: 'No pudimos cargar los datos',
    body: 'Puede ser un problema de conexión. Intenta de nuevo.',
  },
};

export function EmptyState({ variant, onRetry }: EmptyStateProps) {
  const navigate = useNavigate();
  const { icon, title, body, cta } = CONFIG[variant];

  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h4 className="empty-title">{title}</h4>
      <p className="empty-body">{body}</p>
      {variant === 'error' && onRetry && (
        <button type="button" className="btn sm" onClick={onRetry}>
          Reintentar
        </button>
      )}
      {cta && variant !== 'error' && (
        <button type="button" className="btn sm ghost" onClick={() => navigate('/resultados')}>
          {cta}
        </button>
      )}
    </div>
  );
}
