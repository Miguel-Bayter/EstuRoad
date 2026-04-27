import { Chip } from '../../../ui/Chip';
import { HABILIDADES } from '../../../../data/constants';
import { toggle } from '../../../../utils/format';
import type { Perfil } from '../../../../types';

interface Props { profile: Perfil; setProfile: (p: Perfil | ((prev: Perfil) => Perfil)) => void; }

export function StepHabilidades({ profile, setProfile }: Props) {
  return (
    <div className="field">
      <div className="chips">
        {HABILIDADES.map((h) => (
          <Chip
            key={h}
            variant="green"
            active={profile.habilidades.includes(h)}
            onClick={() => setProfile((p) => ({ ...p, habilidades: toggle(p.habilidades, h).slice(-5) }))}
          >
            {h}
          </Chip>
        ))}
      </div>
      <p className="step-hint">Máximo 5 · escogidas: {profile.habilidades.length}</p>
    </div>
  );
}
