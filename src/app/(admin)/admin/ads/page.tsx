import { Suspense } from "react";
import type { Metadata } from "next";
import { listPendingAds } from "@/features/admin/repository";
import { approveAdAction, rejectAdAction } from "@/features/admin/actions";
import { PLACEMENT_LABELS } from "@/features/ads/components/request-ad-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "広告承認",
};

export default function AdminAdsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <h1 className="text-2xl font-semibold text-foreground">広告承認</h1>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <PendingAdsList />
      </Suspense>
    </div>
  );
}

async function PendingAdsList() {
  const pendingAds = await listPendingAds();

  if (pendingAds.length === 0) {
    return <p className="text-muted-foreground">審査待ちの広告はありません。</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {pendingAds.map((ad) => (
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
            <p className="text-xs text-muted-foreground">
              申請者: {ad.requestedByName} / リンク先: {ad.linkUrl}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <form action={rejectAdAction.bind(null, ad.id)}>
              <Button type="submit" variant="outline" size="sm">
                却下
              </Button>
            </form>
            <form action={approveAdAction.bind(null, ad.id)}>
              <Button type="submit" size="sm">
                承認する
              </Button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
