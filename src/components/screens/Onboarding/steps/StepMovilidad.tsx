import { Chip } from '../../../ui/Chip';
import type { Perfil } from '../../../../types';

interface Props { profile: Perfil; setProfile: (p: Perfil | ((prev: Perfil) => Perfil)) => void; }

type Modalidad = 'presencial' | 'virtual' | 'hibrido';

const OPCIONES: { k: Modalidad; titulo: string; desc: string; icon: string; color: string }[] = [
  {
    k: 'presencial',
    titulo: 'Presencial',
    desc: 'Asistes físicamente al campus. Más acceso a laboratorios, red de contactos y vida universitaria.',
    icon: '🏛',
    color: 'var(--green)',
  },
  {
    k: 'virtual',
    titulo: 'Virtual',
    desc: 'Estudias desde donde estés. Ideal si trabajas, tienes familia o vives lejos de grandes ciudades.',
    icon: '💻',
    color: 'var(--sky)',
  },
  {
    k: 'hibrido',
    titulo: 'Híbrido',
    desc: 'Combina lo mejor: clases en línea con asistencia puntual al campus. Cada vez más oferta disponible.',
    icon: '⚡',
    color: 'var(--terra)',
  },
];

export function StepMovilidad({ profile, setProfile }: Props) {
  return (
    <>
      <div className="field" style={{ marginTop: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {OPCIONES.map((o) => {
            const active = profile.modalidad === o.k;
            return (
              <button
                key={o.k}
                type="button"
                onClick={() => setProfile((p) => ({ ...p, modalidad: o.k }))}
                style={{
                  border: `2px solid ${active ? o.color : 'var(--line)'}`,
                  borderRadius: 18,
                  background: active ? o.color : 'var(--paper-2)',
                  color: active ? (o.k === 'virtual' ? 'var(--ink)' : 'var(--paper)') : 'var(--ink)',
                  padding: '24px 20px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'all .15s ease',
                  transform: active ? 'translateY(-2px)' : 'none',
                  boxShadow: active ? 'var(--shadow-md)' : 'none',
                }}
              >
                <span style={{ fontSize: 32 }}>{o.icon}</span>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500 }}>{o.titulo}</strong>
                <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0, opacity: active ? .9 : .65 }}>{o.desc}</p>
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
