import { Chip } from '../../../ui/Chip';
import { INTERESES } from '../../../../data/constants';
import { toggle } from '../../../../utils/format';
import type { Perfil } from '../../../../types';

interface Props { profile: Perfil; setProfile: (p: Perfil | ((prev: Perfil) => Perfil)) => void; }

export function StepIntereses({ profile, setProfile }: Props) {
  return (
    <div className="field">
      <div className="chips">
        {INTERESES.map((i) => (
          <Chip
            key={i.k}
            variant="terra"
            active={profile.intereses.includes(i.k)}
            onClick={() => setProfile((p) => ({ ...p, intereses: toggle(p.intereses, i.k) }))}
          >
            {i.label}
          </Chip>
        ))}
      </div>
      <p className="step-hint">{profile.intereses.length} seleccionados · mínimo 3</p>
    </div>
  );
}
