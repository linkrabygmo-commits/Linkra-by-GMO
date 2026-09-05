import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { CalendarDays, Lock } from "lucide-react";
import { listEvents } from "@/features/events/repository";
import { Badge } from "@/components/ui/badge";
import { formatJstDateTime } from "@/lib/datetime";

export const metadata: Metadata = {
  title: "イベント",
  description: "Linkra by GMOで開催されるイベントの一覧です。",
};

export default function EventsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold text-foreground">イベント</h1>
      <Suspense
        fallback={<p className="text-muted-foreground">読み込み中...</p>}
      >
        <EventList />
      </Suspense>
    </div>
  );
}

async function EventList() {
  const events = await listEvents();

  if (events.length === 0) {
    return (
      <p className="text-muted-foreground">
        現在開催予定のイベントはありません。
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Link
          key={event.id}
          href={`/events/${event.id}`}
          className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-card ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md ${
            event.hasEnded ? "opacity-70" : ""
          }`}
        >
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted">
            {event.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.coverImageUrl}
                alt=""
                className={`size-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  event.hasEnded ? "grayscale" : ""
                }`}
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground/40">
                <CalendarDays className="size-10" />
              </div>
            )}
            {event.hasEnded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <Badge
                  variant="secondary"
                  className="px-3 py-1 text-sm font-semibold"
                >
                  終了
                </Badge>
              </div>
            )}
            {event.audience === "member_only" && (
              <Badge
                variant="outline"
                className="absolute top-3 left-3 gap-1 border-white/40 bg-background/90 backdrop-blur-sm"
              >
                <Lock className="size-3" />
                会員限定
              </Badge>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1.5 px-4 py-4">
            <h2 className="line-clamp-2 text-sm font-semibold text-foreground">
              {event.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              {formatJstDateTime(event.startsAt, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
              {event.location && ` ・ ${event.location}`}
            </p>
            {event.description && (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {event.description}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
