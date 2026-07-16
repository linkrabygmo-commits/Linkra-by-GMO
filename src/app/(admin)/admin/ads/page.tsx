import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { listAllAdsForAdmin } from "@/features/ads/repository";
import { deleteAdAction } from "@/features/ads/actions";
import { PLACEMENT_LABELS } from "@/features/ads/components/ad-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "広告設定",
};

export default function AdminAdsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">広告設定</h1>
        <Button asChild size="sm">
          <Link href="/admin/ads/new">新しい広告を作成</Link>
        </Button>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <AdList />
      </Suspense>
    </div>
  );
}

async function AdList() {
  const ads = await listAllAdsForAdmin();

  if (ads.length === 0) {
    return <p className="text-muted-foreground">まだ広告がありません。</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {ads.map((ad) => (
        <li
          key={ad.id}
          className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 ring-1 ring-foreground/10"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{ad.title}</p>
              <Badge variant="outline">{PLACEMENT_LABELS[ad.placement]}</Badge>
            </div>
            {ad.description && (
              <p className="text-sm text-muted-foreground">{ad.description}</p>
            )}
            <p className="text-xs text-muted-foreground">リンク先: {ad.linkUrl}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/ads/${ad.id}/edit`}>編集</Link>
            </Button>
            <form action={deleteAdAction.bind(null, ad.id)}>
              <Button type="submit" variant="outline" size="sm">
                削除
              </Button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
