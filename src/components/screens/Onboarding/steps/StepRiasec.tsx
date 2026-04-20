import { RIASEC } from '../../../../data/constants';
import { toggle } from '../../../../utils/format';
import type { Perfil } from '../../../../types';

interface Props { profile: Perfil; setProfile: (p: Perfil | ((prev: Perfil) => Perfil)) => void; }

export function StepRiasec({ profile, setProfile }: Props) {
  return (
    <div className="riasec-grid">
      {RIASEC.map((r) => {
        const active = profile.riasec.includes(r.k);
        return (
          <div
            key={r.k}
            className={`riasec ${active ? 'is-active' : ''}`}
            onClick={() => setProfile((p) => ({ ...p, riasec: toggle(p.riasec, r.k).slice(-3) }))}
          >
            <div className="riasec-letter">{r.k}</div>
            <div className="riasec-title">{r.titulo}</div>
            <div className="riasec-cap">{r.desc}</div>
          </div>
        );
      })}
    </div>
  );
}
