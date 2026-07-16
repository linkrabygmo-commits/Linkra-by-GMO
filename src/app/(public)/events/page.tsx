import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { listEvents } from "@/features/events/repository";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "イベント",
  description: "Linkra by GMOで開催されるイベントの一覧です。",
};

export default function EventsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold text-foreground">イベント</h1>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <EventList />
      </Suspense>
    </div>
  );
}

async function EventList() {
  const events = await listEvents();

  if (events.length === 0) {
    return <p className="text-muted-foreground">現在開催予定のイベントはありません。</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {events.map((event) => (
        <li key={event.id}>
          <Link
            href={`/events/${event.id}`}
            className="flex flex-col gap-2 rounded-lg border border-border p-4 transition-colors hover:border-foreground/30"
          >
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium text-foreground">{event.title}</h2>
              {event.audience === "member_only" && (
                <Badge variant="outline" className="gap-1">
                  <Lock className="size-3" />
                  会員限定
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(event.startsAt).toLocaleString("ja-JP", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
              {event.location && ` ・ ${event.location}`}
            </p>
            {event.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
