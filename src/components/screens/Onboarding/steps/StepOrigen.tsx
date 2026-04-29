import { Chip } from '../../../ui/Chip';
import { CIUDADES } from '../../../../data/constants';
import type { Perfil } from '../../../../types';

interface Props {
  profile: Perfil;
  setProfile: (p: Perfil | ((prev: Perfil) => Perfil)) => void;
}

export function StepOrigen({ profile, setProfile }: Props) {
  return (
    <div className="grid-2">
      <div className="field">
        <label className="field-label" htmlFor="ciudad-select">
          Ciudad / municipio
        </label>
        <select
          id="ciudad-select"
          className="select"
          value={profile.ciudad}
          onChange={(e) => {
            const c = CIUDADES.find((x) => x.ciudad === e.target.value);
            setProfile((p) => ({
              ...p,
              ciudad: e.target.value,
              regionId: c?.regionId ?? p.regionId,
            }));
          }}
        >
          {CIUDADES.map((c) => (
            <option key={c.ciudad} value={c.ciudad}>
              {c.ciudad} — {c.region}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label className="field-label">Estrato socioeconómico</label>
        <div className="chips">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Chip
              key={n}
              active={profile.estrato === n}
              onClick={() => setProfile((p) => ({ ...p, estrato: n }))}
            >
              Estrato {n}
            </Chip>
          ))}
        </div>
      </div>
      <div className="field span-2">
        <label className="field-label">¿Qué grado cursas?</label>
        <div className="chips">
          {[
            'Grado 10',
            'Grado 11',
            'Bachiller graduado',
            'Estudiante universitario (cambio)',
            'Otro',
          ].map((g) => (
            <Chip
              key={g}
              active={profile.grado === g}
              onClick={() => setProfile((p) => ({ ...p, grado: g }))}
            >
              {g}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
