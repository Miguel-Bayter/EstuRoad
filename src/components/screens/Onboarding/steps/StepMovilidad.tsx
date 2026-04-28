import { Chip } from '../../../ui/Chip';
import { REGIONES } from '../../../../data/constants';
import type { Perfil } from '../../../../types';

interface Props { profile: Perfil; setProfile: (p: Perfil | ((prev: Perfil) => Perfil)) => void; }

type Modalidad = 'presencial' | 'virtual' | 'hibrido';

const OPCIONES: { k: Modalidad; titulo: string; desc: string; icon: string }[] = [
  {
    k: 'presencial',
    titulo: 'Presencial',
    desc: 'Asistes físicamente al campus. Más acceso a laboratorios, red de contactos y vida universitaria.',
    icon: '🏛',
  },
  {
    k: 'virtual',
    titulo: 'Virtual',
    desc: 'Estudias desde donde estés. Ideal si trabajas, tienes familia o vives lejos de grandes ciudades.',
    icon: '💻',
  },
  {
    k: 'hibrido',
    titulo: 'Híbrido',
    desc: 'Combina lo mejor: clases en línea con asistencia puntual al campus. Cada vez más oferta disponible.',
    icon: '⚡',
  },
];

export function StepMovilidad({ profile, setProfile }: Props) {
  return (
    <>
      <div className="field">
        <div className="modalidad-grid">
          {OPCIONES.map((o) => {
            const active = profile.modalidad === o.k;
            return (
              <button
                key={o.k}
                type="button"
                className={`modalidad-option${active ? ` is-active ${o.k}` : ''}`}
                onClick={() => setProfile((p) => ({ ...p, modalidad: o.k }))}
              >
                <span className="modalidad-icon">{o.icon}</span>
                <strong className="modalidad-title">{o.titulo}</strong>
                <p className="modalidad-desc">{o.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="field">
        <label className="field-label">
          ¿A qué regiones de Colombia estarías dispuesto a moverte para estudiar?
          <span className="field-hint">Tu región ya está incluida. Selecciona las adicionales.</span>
        </label>
        <div className="region-chips">
          <button
            type="button"
            className={`region-chip region-chip--no-move${(profile.regionesDisponibles ?? []).length === 0 ? ' region-chip--selected' : ''}`}
            aria-pressed={(profile.regionesDisponibles ?? []).length === 0}
            onClick={() => setProfile((p) => ({ ...p, regionesDisponibles: [], mudarse: 10 }))}
          >
            <span className="region-chip-name">No me mudo</span>
            <span className="region-chip-cities">Solo opciones en mi ciudad o región</span>
          </button>

          {REGIONES.filter((r) => r.id !== profile.regionId).map((r) => {
            const selected = (profile.regionesDisponibles ?? []).includes(r.id);
            return (
              <button
                key={r.id}
                type="button"
                className={`region-chip${selected ? ' region-chip--selected' : ''}`}
                aria-pressed={selected}
                onClick={() => setProfile((p) => {
                  const prev = p.regionesDisponibles ?? [];
                  const next = prev.includes(r.id)
                    ? prev.filter((x) => x !== r.id)
                    : [...prev, r.id];
                  return { ...p, regionesDisponibles: next, mudarse: next.length === 0 ? 10 : Math.min(98, 30 + next.length * 20) };
                })}
              >
                <span className="region-chip-name">{r.nombre}</span>
                <span className="region-chip-cities">{r.ciudades.slice(0, 2).join(', ')}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="field">
        <label className="field-label">¿Te interesan programas internacionales?</label>
        <div className="chips">
          {['Sí, muchísimo', 'Solo si hay beca', 'No por ahora'].map((r) => (
            <Chip key={r} active={profile.internacional === r} onClick={() => setProfile((p) => ({ ...p, internacional: r }))}>
              {r}
            </Chip>
          ))}
        </div>
      </div>
    </>
  );
}
