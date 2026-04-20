interface ProgressStepsProps {
  total: number;
  current: number;
}

export function ProgressSteps({ total, current }: ProgressStepsProps) {
  return (
    <div className="progress">
      {Array.from({ length: total }).map((_, i) => (
        <i
          key={i}
          className={i < current ? 'done' : i === current ? 'active' : ''}
        />
      ))}
    </div>
  );
}
