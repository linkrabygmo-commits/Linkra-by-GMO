"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type BackButtonTone = "dark" | "light";

interface BackButtonProps {
  tone?: BackButtonTone;
  className?: string;
}

// usePathname()に依存するため、呼び出し側では必ずSuspenseで包む
// (Cache Components: 動的データはSuspense配下でのみアクセス可能)。
export function BackButton({ tone = "dark", className }: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        "inline-flex items-center gap-1 text-sm transition-colors",
        tone === "light"
          ? "text-white/70 hover:text-white"
          : "text-muted-foreground hover:text-primary",
        className,
      )}
    >
      <ArrowLeft className="size-3.5" />
      戻る
    </button>
  );
}

// レイアウトシフトを避けるための、当たり判定なしのプレースホルダー。
export function BackButtonSkeleton({ className }: { className?: string }) {
  return <span className={cn("inline-block h-5", className)} aria-hidden="true" />;
}
