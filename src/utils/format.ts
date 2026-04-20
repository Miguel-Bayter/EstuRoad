export function formatCOP(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace('.0', '')}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

export function toggle<T>(list: T[], v: T): T[] {
  const set = new Set(list);
  set.has(v) ? set.delete(v) : set.add(v);
  return [...set];
}
