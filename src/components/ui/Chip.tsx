interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  variant?: 'terra' | 'green' | '';
  children: React.ReactNode;
}

export function Chip({ active = false, onClick, variant = '', children }: ChipProps) {
  return (
    <button
      type="button"
      className={`chip ${variant} ${active ? 'is-active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {active && <span className="chip-check">✓</span>}
      {children}
    </button>
  );
}
