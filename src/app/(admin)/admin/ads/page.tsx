import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ImageOff } from "lucide-react";
import { listAllAdsForAdmin } from "@/features/ads/repository";
import { deleteAdAction } from "@/features/ads/actions";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "広告設定",
};

export default function AdminAdsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <Breadcrumb
        items={[{ label: "管理画面", href: "/admin" }, { label: "広告設定" }]}
      />
      <PageHeader
        title="広告設定"
        description="サイトトップに表示する広告バナーを管理できます。"
        action={
          <Button asChild size="sm" className="w-fit">
            <Link href="/admin/ads/new">新しい広告を作成</Link>
          </Button>
        }
      />
      <Suspense
        fallback={<p className="text-muted-foreground">読み込み中...</p>}
      >
        <AdList />
      </Suspense>
    </div>
  );
}

async function AdList() {
  const ads = await listAllAdsForAdmin();

  if (ads.length === 0) {
    return (
      <EmptyState
        icon={ImageOff}
        title="まだ広告がありません。"
        description="新しい広告を作成すると、ここに一覧表示されます。"
        action={
          <Button asChild size="sm">
            <Link href="/admin/ads/new">新しい広告を作成</Link>
          </Button>
        }
      />
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {ads.map((ad) => (
        <li key={ad.id}>
          <Card className="flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-4">
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
                  <p className="text-sm font-medium text-foreground">
                    {ad.title}
                  </p>
                )}
                <p className="truncate text-xs text-muted-foreground">
                  リンク先: {ad.linkUrl}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:shrink-0">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/ads/${ad.id}/edit`}>編集</Link>
              </Button>
              <ConfirmSubmitButton
                variant="destructive"
                size="sm"
                action={deleteAdAction.bind(null, ad.id)}
                confirmMessage="この広告を削除します。この操作は取り消せません。よろしいですか？"
              >
                削除
              </ConfirmSubmitButton>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
