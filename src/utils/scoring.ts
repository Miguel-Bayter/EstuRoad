import type { Carrera, Perfil } from '../types';

export function scoreCarrera(carrera: Carrera, perfil: Perfil): number {
  let score = 50;

  const matchIntereses = carrera.intereses.filter((i) =>
    perfil.intereses.includes(i)
  ).length;
  score += matchIntereses * 10;

  const matchRiasec = carrera.ematch.filter((r) =>
    perfil.riasec.includes(r)
  ).length;
  score += matchRiasec * 8;

  if (carrera.costoSemestre <= perfil.presupuesto) score += 10;
  else if (carrera.costoSemestre > perfil.presupuesto * 2) score -= 15;

  const demandaLocal = carrera.demandaPorRegion[perfil.regionId as keyof typeof carrera.demandaPorRegion] ?? 50;

  if (perfil.mudarse < 30) {
    score += (demandaLocal - 60) * 0.3;
  } else {
    const topDemanda = Math.max(...Object.values(carrera.demandaPorRegion));
    score += (topDemanda - 60) * 0.25;
  }

  return Math.max(35, Math.min(98, Math.round(score)));
}
