import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ダッシュボード/管理画面の概要ページで使うサマリーカード。会員=blue、企業/管理系=purple、
// イベント=green、お知らせ=amberという淡いアクセントカラーの対応で統一する。
export const STAT_TONE_CLASSES = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  purple:
    "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  green: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
} as const;

export type StatCardTone = keyof typeof STAT_TONE_CLASSES;

interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  icon: LucideIcon;
  tone: StatCardTone;
  href?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  tone,
  href,
  className,
}: StatCardProps) {
  const content = (
    <Card
      className={cn(
        "gap-3 px-5 py-5 transition-all hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            STAT_TONE_CLASSES[tone],
          )}
        >
          <Icon className="size-5" />
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-3xl font-semibold text-foreground">
        {value}
        {unit && (
          <span className="ml-1 text-base font-normal text-muted-foreground">
            {unit}
          </span>
        )}
      </p>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
