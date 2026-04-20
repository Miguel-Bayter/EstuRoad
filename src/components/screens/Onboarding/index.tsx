import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ProgressSteps } from '../../ui/ProgressSteps';
import { StepOrigen } from './steps/StepOrigen';
import { StepColegio } from './steps/StepColegio';
import { StepBolsillo } from './steps/StepBolsillo';
import { StepMaterias } from './steps/StepMaterias';
import { StepIntereses } from './steps/StepIntereses';
import { StepRiasec } from './steps/StepRiasec';
import { StepHabilidades } from './steps/StepHabilidades';
import { StepMovilidad } from './steps/StepMovilidad';

const STEPS = [
  { id: 'origen',    title: '¿De dónde escribes?',            sub: 'Tu ciudad y contexto cambian qué oportunidades tienes cerca.' },
  { id: 'colegio',   title: 'Cuéntanos sobre tu colegio',     sub: 'Nos ayuda a afinar tus opciones realistas.' },
  { id: 'bolsillo',  title: 'Tu bolsillo, sin vergüenza',     sub: 'Te mostramos carreras viables para tu presupuesto.' },
  { id: 'materias',  title: '¿Qué materias te quedan fáciles?', sub: 'No es lo único que cuenta, pero es una pista.' },
  { id: 'intereses', title: '¿Qué cosas te encienden?',       sub: 'Escoge al menos tres.' },
  { id: 'riasec',    title: '¿Cómo te describirías?',         sub: 'Marca hasta 3 perfiles que más se parezcan a ti.' },
  { id: 'habil',     title: 'Tus superpoderes',               sub: 'Escoge 3 habilidades que reconozcas en ti.' },
  { id: 'movilidad', title: '¿Cómo prefieres estudiar?',  sub: 'La modalidad define qué tan flexible puedes ser con tu ubicación.' },
] as const;

const STEP_COMPONENTS = [
  StepOrigen, StepColegio, StepBolsillo, StepMaterias,
  StepIntereses, StepRiasec, StepHabilidades, StepMovilidad,
];

export function Onboarding() {
  const { profile, setProfile, setScreen } = useApp();
  const [step, setStep] = useState(0);
  const cur = STEPS[step];
  const StepComponent = STEP_COMPONENTS[step];

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setProfile((p) => ({ ...p, completed: true }));
      setScreen('results');
    }
  }

  return (
    <section className="flow">
      <aside className="flow-aside">
        <h4>Tu perfil — paso {step + 1}/{STEPS.length}</h4>
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`flow-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
          >
            <div className="flow-step-n">{i < step ? '✓' : String(i + 1).padStart(2, '0')}</div>
            <div className="flow-step-body">
              <strong>{s.title}</strong>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--paper-2)', borderRadius: 10, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--ink)' }}>Privacidad:</strong> tus datos nunca se venden ni se comparten con universidades sin tu permiso.
        </div>
      </aside>

      <div className="card">
        <div className="card-header">
          <div>
            <span className="mono pl">Paso {String(step + 1).padStart(2, '0')} · {Math.round((step / (STEPS.length - 1)) * 100)}%</span>
            <h3 style={{ marginTop: 10 }}>{cur.title}</h3>
            <p className="card-lede">{cur.sub}</p>
          </div>
          <ProgressSteps total={STEPS.length} current={step + 1} />
        </div>

        <StepComponent profile={profile} setProfile={setProfile} />

        <div className="card-footer">
          <button type="button" className="btn ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
            ← Atrás
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn" onClick={next}>Siguiente →</button>
          ) : (
            <button type="button" className="btn lime" onClick={next}>Ver mis resultados →</button>
          )}
        </div>
      </div>
    </section>
  );
}
