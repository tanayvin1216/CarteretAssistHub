export function AdminPageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-text mb-2">· {eyebrow}</p>
        )}
        <h1 className="font-display text-4xl md:text-5xl text-ink tracking-[-0.02em] leading-tight">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}
