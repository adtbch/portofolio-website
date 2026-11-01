interface TechBadgeProps {
  label: string;
  className?: string;
}

export function TechBadge({ label, className = "" }: TechBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-mono border border-border bg-surface text-foreground ${className}`}
    >
      {label}
    </span>
  );
}
