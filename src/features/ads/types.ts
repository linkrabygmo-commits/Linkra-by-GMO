export interface HeroBanner {
  title: string;
  description?: string;
  /** 背景画像のURL。未指定の場合はグラデーションのプレースホルダーを表示する。 */
  image?: string;
  href: string;
}
