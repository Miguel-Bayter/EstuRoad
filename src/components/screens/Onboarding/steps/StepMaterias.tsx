import { Chip } from '../../../ui/Chip';
import { MATERIAS } from '../../../../data/constants';
import { toggle } from '../../../../utils/format';
import type { Perfil } from '../../../../types';

interface Props { profile: Perfil; setProfile: (p: Perfil | ((prev: Perfil) => Perfil)) => void; }

export function StepMaterias({ profile, setProfile }: Props) {
  return (
    <div className="field">
      <label className="field-label">Selecciona las que te van bien</label>
      <div className="chips">
        {MATERIAS.map((m) => (
          <Chip
            key={m}
            active={profile.materias.includes(m)}
            onClick={() => setProfile((p) => ({ ...p, materias: toggle(p.materias, m) }))}
          >
            {m}
          </Chip>
        ))}
      </div>
    </div>
  );
}
