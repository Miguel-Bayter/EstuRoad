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
      <p style={{ marginTop: 18, fontSize: 12, color: 'var(--ink-2)' }}>
        {profile.intereses.length} seleccionados · mínimo 3
      </p>
    </div>
  );
}
