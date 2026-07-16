import Link from "next/link";
import { cn } from "@/lib/utils";

export type LinkraLogoSize = "sm" | "md" | "lg" | "hero";
export type LinkraLogoTone = "dark" | "light";

interface SizeTokens {
  linkra: string;
  by: string;
  gmoImgHeight: string;
  gap: string;
}

const SIZES: Record<LinkraLogoSize, SizeTokens> = {
  sm: {
    linkra: "text-sm",
    by: "text-[10px]",
    gmoImgHeight: "h-3.5",
    gap: "gap-1",
  },
  md: {
    linkra: "text-base",
    by: "text-[11px]",
    gmoImgHeight: "h-4",
    gap: "gap-1.5",
  },
  lg: {
    linkra: "text-xl",
    by: "text-xs",
    gmoImgHeight: "h-5",
    gap: "gap-2",
  },
  hero: {
    linkra: "text-5xl sm:text-6xl",
    by: "text-xl sm:text-2xl",
    gmoImgHeight: "h-10 sm:h-12",
    gap: "gap-3",
  },
};

interface LinkraLogoProps {
  size?: LinkraLogoSize;
  tone?: LinkraLogoTone;
  /** リンク先。nullを渡すとリンクなしのspanとして描画する。 */
  href?: string | null;
  className?: string;
}

// アプリ全体で使う唯一のブランドロゴ表現。「Linkra by GMO」を各画面で直接
// 文字列として書かず、必ずこのコンポーネント経由で描画する。
export function LinkraLogo({
  size = "md",
  tone = "dark",
  href = "/",
  className,
}: LinkraLogoProps) {
  const tokens = SIZES[size];

  const inner = (
    <>
      <span
        className={cn(
          "font-bold tracking-tight",
          tokens.linkra,
          tone === "light" ? "text-white" : "text-foreground",
        )}
      >
        Linkra
      </span>
      <span
        className={cn(
          "font-semibold",
          tokens.by,
          tone === "light" ? "text-white/85" : "text-muted-foreground",
        )}
      >
        by
      </span>
      <GmoMark size={size} tone={tone} />
    </>
  );

  const classes = cn("inline-flex items-baseline", tokens.gap, className);

  if (!href) {
    return <span className={classes}>{inner}</span>;
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

// 公式ブランドアセット: 暗い背景(tone="light")には白抜き版、
// 明るい背景(tone="dark")にはブランドブルー版を使用する。
function GmoMark({ size, tone }: { size: LinkraLogoSize; tone: LinkraLogoTone }) {
  const tokens = SIZES[size];
  const src = tone === "light" ? "/brand/gmo-logo-white.png" : "/brand/gmo-logo-blue.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="GMO" className={cn("w-auto", tokens.gmoImgHeight)} />
  );
}
