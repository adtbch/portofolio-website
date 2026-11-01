interface StatusBadgeProps {
  available?: boolean;
  text?: string;
  className?: string;
}

export function StatusBadge({
  available = true,
  text = "Available for work",
  className = "",
}: StatusBadgeProps) {
  if (!available) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono text-muted-foreground bg-surface border border-border ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 bg-emerald-500"></span>
      </span>
      <span>{text}</span>
    </div>
  );
}
