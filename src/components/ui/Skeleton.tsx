interface SkeletonProps {
  variant?: 'hero' | 'row' | 'card';
  count?: number;
}

export function Skeleton({ variant = 'row', count = 1 }: SkeletonProps) {
  if (variant === 'hero') {
    return (
      <div className="skeleton skeleton-hero">
        <div className="skeleton-line w-40" />
        <div className="skeleton-line w-70 skeleton-line--lg skeleton-line--mt-12" />
        <div className="skeleton-line w-90 skeleton-line--mt-10" />
        <div className="skeleton-line w-60 skeleton-line--mt-8" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="skeleton skeleton-card">
        <div className="skeleton-line w-30" />
        <div className="skeleton-line w-80 skeleton-line--md skeleton-line--mt-10" />
        <div className="skeleton-line w-100 skeleton-line--mt-8" />
        <div className="skeleton-line w-90 skeleton-line--mt-8" />
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton-row">
          <div className="skeleton-circle" />
          <div className="skeleton-body">
            <div className="skeleton-line w-50" />
            <div className="skeleton-line w-80 skeleton-line--mt-6" />
          </div>
          <div className="skeleton-line w-20" />
        </div>
      ))}
    </>
  );
}
