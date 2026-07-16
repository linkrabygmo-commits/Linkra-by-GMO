import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ImageOff } from "lucide-react";
import { listAllAdsForAdmin } from "@/features/ads/repository";
import { deleteAdAction } from "@/features/ads/actions";
import { Button } from "@/components/ui/button";

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
          className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 ring-1 ring-foreground/10"
        >
          {ad.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ad.imageUrl}
              alt=""
              className="h-14 w-[4.6667rem] shrink-0 rounded-lg border border-border object-cover"
            />
          ) : (
            <span className="flex h-14 w-[4.6667rem] shrink-0 items-center justify-center rounded-lg border border-border bg-accent text-accent-foreground">
              <ImageOff className="size-4" />
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {ad.title && (
              <p className="text-sm font-medium text-foreground">{ad.title}</p>
            )}
            <p className="truncate text-xs text-muted-foreground">
              リンク先: {ad.linkUrl}
            </p>
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
