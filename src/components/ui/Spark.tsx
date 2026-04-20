interface SparkProps {
  values: number[];
  color?: string;
  fill?: boolean;
}

export function Spark({ values, color = 'var(--green)', fill = true }: SparkProps) {
  if (values.length < 2) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const w = 260;
  const h = 70;

  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * w,
    h - ((v - min) / (max - min || 1)) * (h - 10) - 5,
  ]);

  const d = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(' ');
  const dFill = `${d} L${w},${h} L0,${h} Z`;
  const last = pts[pts.length - 1];

  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {fill && <path d={dFill} fill={color} opacity={0.12} />}
      <path d={d} stroke={color} strokeWidth="2" fill="none" />
      <circle cx={last[0]} cy={last[1]} r={3.5} fill={color} />
    </svg>
  );
}
