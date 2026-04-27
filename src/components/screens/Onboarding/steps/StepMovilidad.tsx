import { Chip } from '../../../ui/Chip';
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
