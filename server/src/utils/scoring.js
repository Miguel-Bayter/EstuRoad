/**
 * Computes a compatibility score [35–98] between a career and a student profile.
 * Higher = better match.
 */
export function scoreCarrera(carrera, perfil) {
  let score = 50;

  const matchIntereses = carrera.intereses.filter((i) =>
    perfil.intereses.includes(i)
  ).length;
  score += matchIntereses * 10;

  const matchRiasec = carrera.ematch.filter((r) =>
    perfil.riasec.includes(r)
  ).length;
  score += matchRiasec * 8;

  if (carrera.costoSemestre <= (perfil.presupuesto ?? 0)) score += 10;
  else if (carrera.costoSemestre > (perfil.presupuesto ?? 0) * 2) score -= 15;

  const demanda = carrera.demandaPorRegion ?? {};
  const demandaLocal = demanda[perfil.regionId] ?? 50;

  if ((perfil.mudarse ?? 50) < 30) {
    score += (demandaLocal - 60) * 0.3;
  } else {
    const topDemanda = Math.max(...Object.values(demanda).filter(Number.isFinite), 50);
    score += (topDemanda - 60) * 0.25;
  }

  return Math.max(35, Math.min(98, Math.round(score)));
}
