import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { listAllAnnouncementsForAdmin } from "@/features/announcements/repository";
import { deleteAnnouncementAction } from "@/features/announcements/actions";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatJstDate } from "@/lib/datetime";

export const metadata: Metadata = {
  title: "お知らせ管理",
};

export default function AdminAnnouncementsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <Breadcrumb
        items={[
          { label: "管理画面", href: "/admin" },
          { label: "お知らせ管理" },
        ]}
      />
      <PageHeader
        title="お知らせ管理"
        description="会員向けのお知らせの作成・公開・編集ができます。"
        action={
          <Button asChild size="sm" className="w-fit">
            <Link href="/admin/announcements/new">新しいお知らせを作成</Link>
          </Button>
        }
      />
      <Suspense
        fallback={<p className="text-muted-foreground">読み込み中...</p>}
      >
        <AnnouncementList />
      </Suspense>
    </div>
  );
}

async function AnnouncementList() {
  const announcements = await listAllAnnouncementsForAdmin();

  if (announcements.length === 0) {
    return (
      <EmptyState
        icon={Megaphone}
        title="まだお知らせがありません。"
        description="新しいお知らせを作成すると、ここに一覧表示されます。"
        action={
          <Button asChild size="sm">
            <Link href="/admin/announcements/new">新しいお知らせを作成</Link>
          </Button>
        }
      />
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {announcements.map((announcement) => (
        <li key={announcement.id}>
          <Card className="flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">
                  {announcement.title}
                </p>
                <Badge
                  variant={
                    announcement.status === "published"
                      ? "success"
                      : "secondary"
                  }
                >
                  {announcement.status === "published" ? "公開中" : "下書き"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatJstDate(announcement.createdAt, { dateStyle: "medium" })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:shrink-0">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/announcements/${announcement.id}/edit`}>
                  編集
                </Link>
              </Button>
              <form
                action={deleteAnnouncementAction.bind(null, announcement.id)}
              >
                <ConfirmSubmitButton
                  variant="destructive"
                  size="sm"
                  confirmMessage={`「${announcement.title}」を削除します。この操作は取り消せません。よろしいですか？`}
                >
                  削除
                </ConfirmSubmitButton>
              </form>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
