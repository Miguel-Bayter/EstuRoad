import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { authApi } from '../../api';

interface AuthModalProps {
  onClose: () => void;
}

interface CodeRevealProps {
  publicId: string;
  onClose: () => void;
}

export function CodeRevealModal({ publicId, onClose }: CodeRevealProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(publicId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Guarda tu código</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="modal-body">
          <p className="modal-desc">
            Este es tu <strong>código único</strong>. Guárdalo para recuperar tu perfil
            y resultados desde cualquier dispositivo cuando quieras.
          </p>
          <div className="code-box">
            <span className="code-box-text mono">{publicId}</span>
            <button type="button" className="code-box-copy" onClick={copy}>
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>
          <button type="button" className="btn lime full" onClick={onClose}>
            Listo, lo guardé →
          </button>
        </div>
      </div>
    </div>
  );
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { login } = useApp();
  const navigate = useNavigate();
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
      login({ publicId: perfil.publicId, ciudad: perfil.ciudad });
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
              className="btn lime full"
              onClick={() => { onClose(); navigate('/perfil'); }}
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
              className="btn full"
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
