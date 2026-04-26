interface SkeletonProps {
  variant?: 'hero' | 'row' | 'card';
  count?: number;
}

export function Skeleton({ variant = 'row', count = 1 }: SkeletonProps) {
  if (variant === 'hero') {
    return (
      <div className="skeleton skeleton-hero">
        <div className="skeleton-line w-40" />
        <div className="skeleton-line w-70" style={{ marginTop: 12, height: 36 }} />
        <div className="skeleton-line w-90" style={{ marginTop: 10 }} />
        <div className="skeleton-line w-60" style={{ marginTop: 8 }} />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="skeleton skeleton-card">
        <div className="skeleton-line w-30" />
        <div className="skeleton-line w-80" style={{ marginTop: 10, height: 22 }} />
        <div className="skeleton-line w-100" style={{ marginTop: 8 }} />
        <div className="skeleton-line w-90" style={{ marginTop: 6 }} />
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton-row">
          <div className="skeleton-circle" />
          <div style={{ flex: 1 }}>
            <div className="skeleton-line w-50" />
            <div className="skeleton-line w-80" style={{ marginTop: 6 }} />
          </div>
          <div className="skeleton-line w-20" />
        </div>
      ))}
    </>
  );
}
