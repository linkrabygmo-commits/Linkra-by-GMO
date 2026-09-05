import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { CalendarDays, Copy, Lock } from "lucide-react";
import { listAllEventsForAdmin } from "@/features/events/repository";
import {
  deleteEventAction,
  duplicateEventAction,
} from "@/features/events/actions";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatJstDateTime } from "@/lib/datetime";

export const metadata: Metadata = {
  title: "イベント管理",
};

export default function AdminEventsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <Breadcrumb
        items={[
          { label: "管理画面", href: "/admin" },
          { label: "イベント管理" },
        ]}
      />
      <PageHeader
        title="イベント管理"
        description="開催するイベントの作成・編集・申込確認ができます。"
        action={
          <Button asChild size="sm" className="w-fit">
            <Link href="/admin/events/new">新しいイベントを作成</Link>
          </Button>
        }
      />
      <Suspense
        fallback={<p className="text-muted-foreground">読み込み中...</p>}
      >
        <EventList />
      </Suspense>
    </div>
  );
}

async function EventList() {
  const events = await listAllEventsForAdmin();

  if (events.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="まだイベントがありません。"
        description="新しいイベントを作成すると、ここに一覧表示されます。"
        action={
          <Button asChild size="sm">
            <Link href="/admin/events/new">新しいイベントを作成</Link>
          </Button>
        }
      />
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {events.map((event) => (
        <li key={event.id}>
          <Card className="flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              {event.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.coverImageUrl}
                  alt=""
                  className="h-14 w-[4.6667rem] shrink-0 rounded-lg border border-border object-cover"
                />
              ) : (
                <span className="flex h-14 w-[4.6667rem] shrink-0 items-center justify-center rounded-lg border border-border bg-accent text-accent-foreground">
                  <CalendarDays className="size-4" />
                </span>
              )}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {event.title}
                  </p>
                  {event.audience === "member_only" && (
                    <Badge variant="outline" className="gap-1">
                      <Lock className="size-3" />
                      会員限定
                    </Badge>
                  )}
                  {event.hasEnded && <Badge variant="secondary">終了</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatJstDateTime(event.startsAt, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {event.location && ` ・ ${event.location}`}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:shrink-0">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/events/${event.id}`}>申込確認</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/events/${event.id}/edit`}>編集</Link>
              </Button>
              <form action={duplicateEventAction.bind(null, event.id)}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <Copy className="size-3.5" />
                  複製
                </Button>
              </form>
              <form action={deleteEventAction.bind(null, event.id)}>
                <ConfirmSubmitButton
                  variant="destructive"
                  size="sm"
                  confirmMessage={`「${event.title}」を削除します。この操作は取り消せません。よろしいですか？`}
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
