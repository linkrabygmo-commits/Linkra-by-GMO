import Link from "next/link";
import { cn } from "@/lib/utils";

export type LinkraLogoSize = "sm" | "md" | "lg" | "hero";
export type LinkraLogoTone = "dark" | "light";

// 各サイズにおける画像の高さ。既存のテキストロゴ(Linkra+by+GMO)が実際に
// 占めていた見た目の高さ(フォントサイズ×行高相当)に合わせており、
// 差し替えによってヘッダー/サイドバー等のレイアウトが動かないようにしている。
const HEIGHTS: Record<LinkraLogoSize, string> = {
  sm: "h-[17px]",
  md: "h-5",
  lg: "h-6",
  hero: "h-13 sm:h-16",
};

interface LinkraLogoProps {
  size?: LinkraLogoSize;
  tone?: LinkraLogoTone;
  /** リンク先。nullを渡すとリンクなしのimgとして描画する。 */
  href?: string | null;
  className?: string;
}

// アプリ全体で使う唯一のブランドロゴ表現。「Linkra by GMO」を各画面で直接
// 文字列として書かず、必ずこのコンポーネント経由で描画する。
// 暗い背景(tone="light")には白抜き版、明るい背景(tone="dark")には
// ネイビー版のロゴ画像(いずれも透過PNG)を使用する。
export function LinkraLogo({
  size = "md",
  tone = "dark",
  href = "/",
  className,
}: LinkraLogoProps) {
  const src =
    tone === "light"
      ? "/brand/linkra-logo-light.png"
      : "/brand/linkra-logo-dark.png";

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Linkra by GMO"
      className={cn("w-auto align-middle", HEIGHTS[size], className)}
    />
  );

  if (!href) {
    return img;
  }

  return (
    <Link href={href} className="inline-block">
      {img}
    </Link>
  );
}
