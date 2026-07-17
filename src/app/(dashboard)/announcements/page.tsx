import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { listPublishedAnnouncements } from "@/features/announcements/repository";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "Linkra by GMOからのお知らせ一覧です。",
};

export default function AnnouncementsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold text-foreground">お知らせ</h1>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <AnnouncementList />
      </Suspense>
    </div>
  );
}

async function AnnouncementList() {
  const announcements = await listPublishedAnnouncements();

  if (announcements.length === 0) {
    return <p className="text-muted-foreground">まだお知らせはありません。</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {announcements.map((announcement) => (
        <li key={announcement.id}>
          <Link
            href={`/announcements/${announcement.id}`}
            className="flex flex-col gap-2 rounded-lg border border-border p-4 transition-colors hover:border-foreground/30"
          >
            <h2 className="text-base font-medium text-foreground">{announcement.title}</h2>
            {announcement.publishedAt && (
              <p className="text-sm text-muted-foreground">
                {new Date(announcement.publishedAt).toLocaleDateString("ja-JP", {
                  dateStyle: "medium",
                })}
              </p>
            )}
            <p className="line-clamp-2 text-sm text-muted-foreground">{announcement.body}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
