import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        // 以下4色は「淡い背景+濃い文字」で統一(destructiveと同じレシピ)。
        // 承認済み/公開中/完了などのポジティブな状態を表す。
        success:
          "bg-green-500/10 text-green-700 [a]:hover:bg-green-500/20 dark:bg-green-500/15 dark:text-green-400",
        // 会員・検索など基本アクションに関連する情報、または進行中の状態を表す。
        info: "bg-blue-500/10 text-blue-700 [a]:hover:bg-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400",
        // 申請中/確認中など、管理者の判断待ちの状態を表す。
        review:
          "bg-purple-500/10 text-purple-700 [a]:hover:bg-purple-500/20 dark:bg-purple-500/15 dark:text-purple-400",
        // 下書き・保留など、注意を促したい状態を表す。
        warning:
          "bg-amber-500/10 text-amber-700 [a]:hover:bg-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
