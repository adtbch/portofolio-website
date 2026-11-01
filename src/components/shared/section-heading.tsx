interface SectionHeadingProps {
  index?: string;
  title: string;
  description?: string;
}

export function SectionHeading({ index, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-2 mb-10">
      {index && (
        <span className="font-mono text-xs text-accent tracking-widest uppercase">
          {index}
        </span>
      )}
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
