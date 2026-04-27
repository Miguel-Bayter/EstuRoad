import { Chip } from '../../../ui/Chip';
import type { Perfil } from '../../../../types';

interface Props { profile: Perfil; setProfile: (p: Perfil | ((prev: Perfil) => Perfil)) => void; }

export function StepBolsillo({ profile, setProfile }: Props) {
  return (
    <>
      <div className="field">
        <label className="field-label">¿Cuánto puede pagar tu familia por semestre?</label>
        <input
          type="range" className="slider" min="0" max="20000000" step="500000"
          value={profile.presupuesto}
          onChange={(e) => setProfile((p) => ({ ...p, presupuesto: parseInt(e.target.value) }))}
        />
        <div className="budget-display">
          <div className="budget-amount">
            {profile.presupuesto === 0 ? 'Solo pública' : `$${(profile.presupuesto / 1e6).toFixed(1)}M / sem`}
          </div>
          <span className="mono pl">COP · por semestre</span>
        </div>
      </div>
      <div className="grid-2 grid-2--mt">
        <div className="field">
          <label className="field-label">¿Considerarías crédito ICETEX?</label>
          <div className="chips">
            {['Sí, claro','Solo si es necesario','No'].map((r) => (
              <Chip key={r} active={profile.icetex === r} onClick={() => setProfile((p) => ({ ...p, icetex: r }))}>{r}</Chip>
            ))}
          </div>
        </div>
        <div className="field">
          <label className="field-label">¿Necesitas trabajar mientras estudias?</label>
          <div className="chips">
            {['Sí, desde el inicio','A partir de 3er semestre','No, solo estudiar'].map((r) => (
              <Chip key={r} active={profile.trabajar === r} onClick={() => setProfile((p) => ({ ...p, trabajar: r }))}>{r}</Chip>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
