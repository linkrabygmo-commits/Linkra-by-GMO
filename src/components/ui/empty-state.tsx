import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// 一覧画面のトップレベルな「データがありません」状態を、アイコン+説明+アクションで
// 分かりやすく示すための共通コンポーネント。ダッシュボードの小さなサブカード内の空文言
// (最近のアクティビティ等)には過剰装飾になるため使わず、独立した一覧ページにのみ使う。
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
