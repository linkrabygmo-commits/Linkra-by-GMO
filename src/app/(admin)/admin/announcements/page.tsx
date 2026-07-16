import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { listAllAnnouncementsForAdmin } from "@/features/announcements/repository";
import { deleteAnnouncementAction } from "@/features/announcements/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "お知らせ管理",
};

export default function AdminAnnouncementsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">お知らせ管理</h1>
        <Button asChild size="sm">
          <Link href="/admin/announcements/new">新しいお知らせを作成</Link>
        </Button>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <AnnouncementList />
      </Suspense>
    </div>
  );
}

async function AnnouncementList() {
  const announcements = await listAllAnnouncementsForAdmin();

  if (announcements.length === 0) {
    return <p className="text-muted-foreground">まだお知らせがありません。</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {announcements.map((announcement) => (
        <li
          key={announcement.id}
          className="flex items-start justify-between gap-4 rounded-lg border border-border px-4 py-3"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{announcement.title}</p>
              <Badge variant={announcement.status === "published" ? "default" : "secondary"}>
                {announcement.status === "published" ? "公開中" : "下書き"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(announcement.createdAt).toLocaleDateString("ja-JP", {
                dateStyle: "medium",
              })}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/announcements/${announcement.id}/edit`}>編集</Link>
            </Button>
            <form action={deleteAnnouncementAction.bind(null, announcement.id)}>
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
