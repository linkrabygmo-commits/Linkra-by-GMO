export function MaskedField({
  label,
  value,
  canView,
}: {
  label: string;
  value: string | null;
  canView: boolean;
}) {
  if (canView) {
    if (!value) return null;
    return (
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="whitespace-pre-wrap text-sm text-foreground">{value}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm tracking-widest text-muted-foreground">
        ＊＊＊＊＊＊＊＊＊＊
      </p>
    </div>
  );
}
