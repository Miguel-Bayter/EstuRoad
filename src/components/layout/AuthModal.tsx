import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authApi } from '../../api';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { login, setScreen } = useApp();
  const [tab, setTab] = useState<'nueva' | 'recuperar'>('nueva');
  const [publicId, setPublicId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRecover() {
    const id = publicId.trim();
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const perfil = await authApi.recover(id);
      login({ publicId: perfil.publicId, sessionToken: '', ciudad: perfil.ciudad });
      onClose();
    } catch {
      setError('No encontramos ese código. Verifícalo e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Tu sesión en EstuRoad</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="modal-tabs">
          <button
            type="button"
            className={`modal-tab ${tab === 'nueva' ? 'is-active' : ''}`}
            onClick={() => setTab('nueva')}
          >
            Nueva sesión
          </button>
          <button
            type="button"
            className={`modal-tab ${tab === 'recuperar' ? 'is-active' : ''}`}
            onClick={() => setTab('recuperar')}
          >
            Tengo un código
          </button>
        </div>

        {tab === 'nueva' ? (
          <div className="modal-body">
            <p className="modal-desc">
              Al completar el cuestionario te asignamos un <strong>código único</strong>.
              Guárdalo para retomar tu perfil y resultados cuando quieras.
            </p>
            <button
              type="button"
              className="btn lime"
              style={{ width: '100%' }}
              onClick={() => { onClose(); setScreen('onboarding'); }}
            >
              Empezar cuestionario →
            </button>
          </div>
        ) : (
          <div className="modal-body">
            <p className="modal-desc">Ingresa tu código para recuperar tu perfil y resultados.</p>
            <input
              className="modal-input"
              type="text"
              placeholder="ej. abc123def456"
              value={publicId}
              onChange={(e) => { setPublicId(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleRecover()}
              autoFocus
            />
            {error && <p className="modal-error">{error}</p>}
            <button
              type="button"
              className="btn"
              style={{ width: '100%' }}
              disabled={loading || !publicId.trim()}
              onClick={handleRecover}
            >
              {loading ? 'Buscando…' : 'Recuperar sesión →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
