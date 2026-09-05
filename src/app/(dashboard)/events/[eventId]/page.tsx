import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock, SquarePen } from "lucide-react";
import { getEventById } from "@/features/events/repository";
import { getCurrentUser } from "@/lib/auth/session";
import {
  applyAsMemberAction,
  cancelMyApplicationAction,
} from "@/features/events/actions";
import { GuestApplicationForm } from "@/features/events/components/guest-application-form";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { EventDetailSkeleton } from "@/components/layout/detail-skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { Linkify } from "@/components/ui/linkify";
import { formatJstDateTime } from "@/lib/datetime";

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
      <Suspense fallback={<EventDetailSkeleton />}>
        <EventDetail paramsPromise={params} />
      </Suspense>
    </div>
  );
}

async function EventDetail({
  paramsPromise,
}: {
  paramsPromise: EventDetailPageProps["params"];
}) {
  const { eventId } = await paramsPromise;
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  const user = await getCurrentUser();
  const isFull = event.capacity != null && event.appliedCount >= event.capacity;
  const isPastDeadline = event.isPastDeadline;
  // 管理者の確定作業は不要にしたため、申込者側には審査中/確定を区別せず
  // 「済(申込あり)」「未(申込なし/キャンセル済み)」の2状態だけを見せる。
  const hasActiveApplication =
    event.myApplicationStatus != null &&
    event.myApplicationStatus !== "cancelled";
  const isGuestFormShown =
    !user &&
    !hasActiveApplication &&
    !isPastDeadline &&
    !isFull &&
    event.audience !== "member_only";

  return (
    <>
      <Breadcrumb
        items={[{ label: "イベント", href: "/events" }, { label: event.title }]}
      />

      {event.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.coverImageUrl}
          alt=""
          className="aspect-[4/3] w-full rounded-xl border border-border object-cover"
        />
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-foreground">
              {event.title}
            </h1>
            {event.audience === "member_only" && (
              <Badge variant="outline" className="gap-1">
                <Lock className="size-3" />
                会員限定
              </Badge>
            )}
          </div>
          <CopyLinkButton
            path={`/events/${event.id}`}
            label="招待リンクをコピー"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {formatJstDateTime(event.startsAt, {
            dateStyle: "full",
            timeStyle: "short",
          })}
          {event.endsAt &&
            ` 〜 ${formatJstDateTime(event.endsAt, { timeStyle: "short" })}`}
        </p>
        {event.location && (
          <p className="text-sm text-muted-foreground">
            開催場所: {event.location}
          </p>
        )}
        {event.capacity != null && (
          <p className="text-sm text-muted-foreground">
            定員: {event.capacity}名
          </p>
        )}
        {event.applicationDeadline && (
          <p className="text-sm text-muted-foreground">
            回答期限:{" "}
            {formatJstDateTime(event.applicationDeadline, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-primary/25 bg-card">
        <div className="flex items-start gap-3 bg-primary/5 px-5 py-4 sm:px-6">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <SquarePen className="size-4" />
          </span>
          <div className="flex flex-col gap-0.5 pt-0.5">
            <h2 className="text-base font-semibold text-primary">参加申込</h2>
            {isGuestFormShown && (
              <p className="text-sm text-muted-foreground">
                下記フォームにご入力のうえ、お申し込みください。
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5 sm:px-6">
          {hasActiveApplication ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-foreground">お申し込み状況: 済</p>
              <form action={cancelMyApplicationAction.bind(null, event.id)}>
                <Button type="submit" variant="outline" size="sm">
                  キャンセルする
                </Button>
              </form>
            </div>
          ) : isPastDeadline ? (
            <div className="flex flex-col gap-3">
              {user && (
                <p className="text-sm text-foreground">お申し込み状況: 未</p>
              )}
              <p className="text-sm text-muted-foreground">
                回答期限を過ぎたため、参加申込を締め切りました。
              </p>
            </div>
          ) : !user && event.audience === "member_only" ? (
            <p className="text-sm text-muted-foreground">
              このイベントは会員限定です。参加するには
              <Link href="/login" className="mx-1 text-primary hover:underline">
                ログイン
              </Link>
              または
              <Link
                href="/signup"
                className="mx-1 text-primary hover:underline"
              >
                会員登録
              </Link>
              してください。
            </p>
          ) : isFull ? (
            <div className="flex flex-col gap-3">
              {user && (
                <p className="text-sm text-foreground">お申し込み状況: 未</p>
              )}
              <p className="text-sm text-muted-foreground">
                満席となりました。
              </p>
            </div>
          ) : user ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-foreground">お申し込み状況: 未</p>
              <form action={applyAsMemberAction.bind(null, event.id)}>
                <Button type="submit">参加を申し込む</Button>
              </form>
            </div>
          ) : (
            <GuestApplicationForm eventId={event.id} />
          )}
        </div>
      </div>

      {event.description && (
        <Linkify text={event.description} className="text-sm text-foreground" />
      )}
    </>
  );
}
