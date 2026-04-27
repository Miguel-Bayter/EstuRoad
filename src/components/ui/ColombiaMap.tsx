const COL_POINTS: [number, number][] = [
  [0.45,0.05],[0.55,0.08],[0.65,0.12],[0.38,0.12],
  [0.50,0.18],[0.62,0.20],[0.72,0.18],[0.80,0.22],
  [0.42,0.28],[0.48,0.30],[0.54,0.28],[0.60,0.32],
  [0.38,0.38],[0.46,0.40],[0.52,0.42],[0.58,0.42],[0.64,0.40],
  [0.42,0.50],[0.48,0.52],[0.54,0.52],[0.60,0.52],
  [0.68,0.40],[0.76,0.42],[0.82,0.44],[0.88,0.48],
  [0.72,0.52],[0.80,0.54],[0.88,0.58],
  [0.32,0.35],[0.28,0.42],[0.26,0.50],[0.28,0.58],[0.32,0.65],
  [0.40,0.62],[0.48,0.65],[0.56,0.68],[0.64,0.70],[0.72,0.72],
  [0.44,0.75],[0.52,0.78],[0.60,0.82],[0.68,0.85],
  [0.48,0.88],[0.56,0.92],
];

const REGION_COORDS: Record<string, { x: number; y: number; label: string; color: string }> = {
  caribe:    { x:0.56, y:0.15, label:'Caribe',    color:'var(--terra)' },
  andina:    { x:0.50, y:0.42, label:'Andina',    color:'var(--green)' },
  pacifico:  { x:0.28, y:0.52, label:'Pacífica',  color:'var(--plum)' },
  orinoquia: { x:0.78, y:0.50, label:'Orinoquía', color:'var(--lime)' },
  amazonia:  { x:0.56, y:0.78, label:'Amazonía',  color:'var(--green-soft)' },
  insular:   { x:0.14, y:0.10, label:'Insular',   color:'var(--sky)' },
};

interface RegionHighlight {
  regionId: string;
  intensity: number;
  count: number;
}

interface ColombiaMapProps {
  highlights?: RegionHighlight[];
  activeRegion?: string | null;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  height?: number;
}

export function ColombiaMap({
  highlights = [],
  activeRegion,
  onHover,
  onSelect,
  height = 520,
}: ColombiaMapProps) {
  const W = 500;
  const H = height;
  const byReg = Object.fromEntries(highlights.map((r) => [r.regionId, r]));

  return (
    <svg
      className="map-svg"
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      aria-labelledby="map-title"
      role="group"
    >
      <title id="map-title">Mapa de Colombia con demanda por región</title>

      {COL_POINTS.map(([px, py], i) => (
        <circle key={i} cx={px * W} cy={py * H} r={2.2} fill="var(--line)" aria-hidden="true" />
      ))}

      {Object.entries(REGION_COORDS).map(([id, info]) => {
        const hl = byReg[id];
        const intensity = hl ? hl.intensity : 0.15;
        const size = 14 + intensity * 40;
        const active = activeRegion === id;
        const demand = hl ? Math.round(hl.intensity * 100) : 0;

        return (
          <g
            key={id}
            className="map-region"
            role="button"
            tabIndex={0}
            aria-label={`${info.label}: demanda ${demand}%`}
            aria-pressed={active}
            onMouseEnter={() => onHover?.(id)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => onSelect?.(id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(id);
              }
            }}
          >
            <circle cx={info.x * W} cy={info.y * H} r={size * 1.5} fill={info.color} opacity={active ? 0.25 : 0.12} aria-hidden="true" />
            <circle cx={info.x * W} cy={info.y * H} r={size * 0.55} fill={info.color} opacity={active ? 1 : 0.85} stroke="var(--ink)" strokeWidth={active ? 2 : 0} aria-hidden="true" />
            <text
              x={info.x * W} y={info.y * H + size * 1.5 + 14}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="10"
              fill="var(--ink-2)"
              className="map-label"
              aria-hidden="true"
            >
              {info.label}
            </text>
            {hl && (
              <text
                x={info.x * W} y={info.y * H + 3}
                textAnchor="middle"
                fontFamily="var(--font-display)"
                fontStyle="italic"
                fontSize="14"
                fontWeight="500"
                fill="var(--paper)"
                aria-hidden="true"
              >
                {hl.count}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
