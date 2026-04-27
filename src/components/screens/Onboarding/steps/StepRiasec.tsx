import { RIASEC } from '../../../../data/constants';
import { toggle } from '../../../../utils/format';
import type { Perfil } from '../../../../types';

interface Props { profile: Perfil; setProfile: (p: Perfil | ((prev: Perfil) => Perfil)) => void; }

export function StepRiasec({ profile, setProfile }: Props) {
  return (
    <div className="riasec-grid">
      {RIASEC.map((r) => {
        const active = profile.riasec.includes(r.k);
        function toggle_() { setProfile((p) => ({ ...p, riasec: toggle(p.riasec, r.k).slice(-3) })); }
        return (
          <div
            key={r.k}
            className={`riasec ${active ? 'is-active' : ''}`}
            role="button"
            tabIndex={0}
            aria-pressed={active}
            onClick={toggle_}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle_(); } }}
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
