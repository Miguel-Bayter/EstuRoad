import { Chip } from '../../../ui/Chip';
import type { Perfil } from '../../../../types';

interface Props { profile: Perfil; setProfile: (p: Perfil | ((prev: Perfil) => Perfil)) => void; }

export function StepColegio({ profile, setProfile }: Props) {
  return (
    <div className="grid-2">
      <div className="field">
        <label className="field-label">Tipo de colegio</label>
        <div className="chips">
          {['Público','Privado','Concesión','Técnico','Rural'].map((t) => (
            <Chip key={t} active={profile.colegioTipo === t} onClick={() => setProfile((p) => ({ ...p, colegioTipo: t }))}>{t}</Chip>
          ))}
        </div>
      </div>
      <div className="field">
        <label className="field-label">Promedio aproximado (1.0 – 5.0)</label>
        <input
          type="range" className="slider" min="1" max="5" step="0.1"
          value={profile.promedio}
          onChange={(e) => setProfile((p) => ({ ...p, promedio: parseFloat(e.target.value) }))}
        />
        <div className="saber-display">{profile.promedio.toFixed(1)}</div>
      </div>
      <div className="field span-2">
        <label className="field-label">Resultado Saber 11 (opcional)</label>
        <div className="chips">
          {['No lo he presentado','Menos de 250','250–299','300–349','350–399','400+'].map((r) => (
            <Chip key={r} active={profile.saber === r} onClick={() => setProfile((p) => ({ ...p, saber: r }))}>{r}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
