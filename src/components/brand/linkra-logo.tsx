import Link from "next/link";
import { cn } from "@/lib/utils";

export type LinkraLogoSize = "sm" | "md" | "lg" | "hero";
export type LinkraLogoTone = "dark" | "light";

interface SizeTokens {
  linkra: string;
  by: string;
  gmoImgHeight: string;
  spacing: string;
}

const SIZES: Record<LinkraLogoSize, SizeTokens> = {
  sm: {
    linkra: "text-sm",
    by: "text-[10px]",
    gmoImgHeight: "h-3.5",
    spacing: "ml-1",
  },
  md: {
    linkra: "text-base",
    by: "text-[11px]",
    gmoImgHeight: "h-4",
    spacing: "ml-1.5",
  },
  lg: {
    linkra: "text-xl",
    by: "text-xs",
    gmoImgHeight: "h-5",
    spacing: "ml-2",
  },
  hero: {
    linkra: "text-5xl sm:text-6xl",
    by: "text-xl sm:text-2xl",
    gmoImgHeight: "h-10 sm:h-12",
    spacing: "ml-3",
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

  // flexのitems-baselineはテキストの「ベースライン」に揃うため、"by"の
  // "y"のディセンダー(文字の下にはみ出る部分)より上に見えてしまう。
  // GMOマークを"by"と同じ要素の子にして、vertical-align: text-bottomで
  // "by"自身のフォントの下端(ディセンダーを含む実際の見た目の下端)に
  //揃える。この揃え方はflexでは効かないため、コンテナはinline-blockにする。
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
          tokens.spacing,
          tone === "light" ? "text-white/85" : "text-muted-foreground",
        )}
      >
        by
        <GmoMark size={size} tone={tone} spacingClassName={tokens.spacing} />
      </span>
    </>
  );

  const classes = cn("inline-block", className);

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
function GmoMark({
  size,
  tone,
  spacingClassName,
}: {
  size: LinkraLogoSize;
  tone: LinkraLogoTone;
  spacingClassName: string;
}) {
  const tokens = SIZES[size];
  const src = tone === "light" ? "/brand/gmo-logo-white.png" : "/brand/gmo-logo-blue.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="GMO"
      className={cn(
        "inline-block w-auto align-text-bottom",
        tokens.gmoImgHeight,
        spacingClassName,
      )}
    />
  );
}
