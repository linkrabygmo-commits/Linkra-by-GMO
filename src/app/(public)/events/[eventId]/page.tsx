import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";
import { getEventById } from "@/features/events/repository";
import { getCurrentUser } from "@/lib/auth/session";
import { applyAsMemberAction, cancelMyApplicationAction } from "@/features/events/actions";
import { GuestApplicationForm } from "@/features/events/components/guest-application-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const APPLICATION_STATUS_LABELS = {
  pending: "審査中",
  confirmed: "確定",
  cancelled: "キャンセル済み",
} as const;

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <EventDetail paramsPromise={params} />
      </Suspense>
    </div>
  );
}

async function EventDetail({ paramsPromise }: { paramsPromise: EventDetailPageProps["params"] }) {
  const { eventId } = await paramsPromise;
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  const user = await getCurrentUser();
  const isFull = event.capacity != null && event.appliedCount >= event.capacity;

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-foreground">{event.title}</h1>
          {event.audience === "member_only" && (
            <Badge variant="outline" className="gap-1">
              <Lock className="size-3" />
              会員限定
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date(event.startsAt).toLocaleString("ja-JP", {
            dateStyle: "full",
            timeStyle: "short",
          })}
          {event.endsAt &&
            ` 〜 ${new Date(event.endsAt).toLocaleString("ja-JP", { timeStyle: "short" })}`}
        </p>
        {event.location && (
          <p className="text-sm text-muted-foreground">開催場所: {event.location}</p>
        )}
        {event.capacity != null && (
          <p className="text-sm text-muted-foreground">
            定員: {event.capacity}名(現在{event.appliedCount}名申込)
          </p>
        )}
        {event.description && (
          <p className="whitespace-pre-line text-sm text-foreground">{event.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border p-5">
        <h2 className="text-base font-medium text-foreground">参加申込</h2>

        {event.myApplicationStatus ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-foreground">
              お申し込み状況: {APPLICATION_STATUS_LABELS[event.myApplicationStatus]}
            </p>
            {event.myApplicationStatus !== "cancelled" && (
              <form action={cancelMyApplicationAction.bind(null, event.id)}>
                <Button type="submit" variant="outline" size="sm">
                  キャンセルする
                </Button>
              </form>
            )}
          </div>
        ) : !user && event.audience === "member_only" ? (
          <p className="text-sm text-muted-foreground">
            このイベントは会員限定です。参加するには
            <Link href="/login" className="mx-1 text-primary hover:underline">
              ログイン
            </Link>
            または
            <Link href="/signup" className="mx-1 text-primary hover:underline">
              会員登録
            </Link>
            してください。
          </p>
        ) : isFull ? (
          <p className="text-sm text-muted-foreground">満席となりました。</p>
        ) : user ? (
          <form action={applyAsMemberAction.bind(null, event.id)}>
            <Button type="submit">参加を申し込む</Button>
          </form>
        ) : (
          <GuestApplicationForm eventId={event.id} />
        )}
      </div>
    </>
  );
}
