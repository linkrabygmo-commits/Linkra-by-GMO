import Link from "next/link";
import { cn } from "@/lib/utils";

export type LinkraLogoSize = "sm" | "md" | "lg" | "hero";
export type LinkraLogoTone = "dark" | "light";

interface SizeTokens {
  linkra: string;
  by: string;
  gmoText: string;
  gmoImgHeight: string;
  gap: string;
}

const SIZES: Record<LinkraLogoSize, SizeTokens> = {
  sm: {
    linkra: "text-sm",
    by: "text-[10px]",
    gmoText: "text-sm",
    gmoImgHeight: "h-3.5",
    gap: "gap-1",
  },
  md: {
    linkra: "text-base",
    by: "text-[11px]",
    gmoText: "text-base",
    gmoImgHeight: "h-4",
    gap: "gap-1.5",
  },
  lg: {
    linkra: "text-xl",
    by: "text-xs",
    gmoText: "text-xl",
    gmoImgHeight: "h-5",
    gap: "gap-2",
  },
  hero: {
    linkra: "text-5xl sm:text-6xl",
    by: "text-xl sm:text-2xl",
    gmoText: "text-5xl sm:text-6xl",
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

// 公式ブランドアセット(白抜き版)を暗い背景(tone="light")で使用する。
// 明るい背景(tone="dark")向けの色版アセットが用意でき次第、そちらも画像に
// 差し替える。それまでの間は、視覚バランスのみ近づけた仮のテキスト表現。
function GmoMark({ size, tone }: { size: LinkraLogoSize; tone: LinkraLogoTone }) {
  const tokens = SIZES[size];

  if (tone === "light") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/brand/gmo-logo-white.png"
        alt="GMO"
        className={cn("w-auto self-center", tokens.gmoImgHeight)}
      />
    );
  }

  return (
    <span
      className={cn(
        "font-extrabold tracking-tight text-foreground",
        tokens.gmoText,
      )}
    >
      GMO
    </span>
  );
}
