import type { HeroBanner } from "@/features/ads/types";

const HERO_BANNERS: HeroBanner[] = [
  {
    title: "GMOグループの最新サービス",
    description: "GMOインターネットグループの多彩なサービスをご紹介します。",
    href: "#",
  },
  {
    title: "会員限定キャンペーン実施中",
    description: "今だけの特別オファーをぜひチェックしてください。",
    href: "#",
  },
  {
    title: "会員限定イベント開催中",
    description: "ビジネスの輪が広がるイベントを随時開催しています。",
    href: "#",
  },
  {
    title: "Linkra by GMO からのお知らせ",
    description: "最新のお知らせ・アップデート情報をお届けします。",
    href: "#",
  },
];

// Phase 9(広告機能)実装後は、この関数の中身をDBからの取得(features/ads/repository.ts)
// に差し替える。呼び出し側(TOPページ)は async関数を呼ぶだけなので変更不要。
export async function listActiveHeroBanners(): Promise<HeroBanner[]> {
  return HERO_BANNERS;
}
