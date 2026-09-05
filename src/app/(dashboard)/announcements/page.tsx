import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { listPublishedAnnouncements } from "@/features/announcements/repository";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { formatJstDate } from "@/lib/datetime";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "Linkra by GMOからのお知らせ一覧です。",
};

export default function AnnouncementsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <PageHeader
        title="お知らせ"
        description="運営からのお知らせを確認できます。"
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
  const announcements = await listPublishedAnnouncements();

  if (announcements.length === 0) {
    return (
      <EmptyState
        icon={Megaphone}
        title="まだお知らせはありません。"
        description="新しいお知らせが公開されるとここに表示されます。"
      />
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {announcements.map((announcement) => (
        <li key={announcement.id}>
          <Link href={`/announcements/${announcement.id}`}>
            <Card className="gap-2 px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <h2 className="text-base font-medium text-foreground">
                {announcement.title}
              </h2>
              {announcement.publishedAt && (
                <p className="text-sm text-muted-foreground">
                  {formatJstDate(announcement.publishedAt, {
                    dateStyle: "medium",
                  })}
                </p>
              )}
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {announcement.body}
              </p>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
