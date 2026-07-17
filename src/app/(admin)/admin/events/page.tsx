import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { listAllEventsForAdmin } from "@/features/events/repository";
import { deleteEventAction } from "@/features/events/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "イベント管理",
};

export default function AdminEventsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">イベント管理</h1>
        <Button asChild size="sm" className="w-fit">
          <Link href="/admin/events/new">新しいイベントを作成</Link>
        </Button>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <EventList />
      </Suspense>
    </div>
  );
}

async function EventList() {
  const events = await listAllEventsForAdmin();

  if (events.length === 0) {
    return <p className="text-muted-foreground">まだイベントがありません。</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 ring-1 ring-foreground/10 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{event.title}</p>
              {event.audience === "member_only" && (
                <Badge variant="outline" className="gap-1">
                  <Lock className="size-3" />
                  会員限定
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(event.startsAt).toLocaleString("ja-JP", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
              {event.location && ` ・ ${event.location}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/events/${event.id}`}>申込確認</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/events/${event.id}/edit`}>編集</Link>
            </Button>
            <form action={deleteEventAction.bind(null, event.id)}>
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
