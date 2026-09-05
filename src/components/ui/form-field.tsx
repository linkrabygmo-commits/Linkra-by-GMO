import { Label } from "@/components/ui/label";

// 管理系フォーム(イベント/お知らせ/広告/企業作成/プロフィール等)共通のフィールド縦積み
// ラッパー。Label(+必須バッジ)/入力欄/エラー文言/補足文言、という階層を統一する。
// 参加申込フォーム(guest-application-form.tsx)は別デザインとして既に確定しているため対象外。
interface FormFieldProps {
  htmlFor: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function RequiredBadge() {
  return (
    <span className="inline-flex shrink-0 items-center rounded bg-destructive px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
      必須
    </span>
  );
}

export function FormField({
  htmlFor,
  label,
  required,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor} className="items-center gap-1.5">
        {label}
        {required && <RequiredBadge />}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
