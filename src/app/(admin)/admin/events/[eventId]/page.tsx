import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventById, listEventApplications } from "@/features/events/repository";
import { updateApplicationStatusAction } from "@/features/events/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "イベント申込確認",
};

const STATUS_LABELS = {
  pending: "審査中",
  confirmed: "確定",
  cancelled: "キャンセル済み",
} as const;

const STATUS_BADGE_VARIANTS = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "destructive",
} as const;

interface AdminEventPageProps {
  params: Promise<{ eventId: string }>;
}

export default function AdminEventApplicationsPage({ params }: AdminEventPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <ApplicationsList paramsPromise={params} />
      </Suspense>
    </div>
  );
}

async function ApplicationsList({ paramsPromise }: { paramsPromise: AdminEventPageProps["params"] }) {
  const { eventId } = await paramsPromise;
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  const applications = await listEventApplications(eventId);

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">{event.title}</h1>
        <p className="text-sm text-muted-foreground">申込者一覧({applications.length}件)</p>
      </div>

      {applications.length === 0 ? (
        <p className="text-muted-foreground">まだ申込はありません。</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {applications.map((application) => (
            <li
              key={`${application.type}-${application.id}`}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 ring-1 ring-foreground/10 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{application.name}</p>
                  <Badge variant="outline">
                    {application.type === "member" ? "会員" : "ゲスト"}
                  </Badge>
                  <Badge variant={STATUS_BADGE_VARIANTS[application.status]}>
                    {STATUS_LABELS[application.status]}
                  </Badge>
                </div>
                {application.email && (
                  <p className="text-xs text-muted-foreground">
                    {application.email}
                    {application.phone && ` / ${application.phone}`}
                  </p>
                )}
              </div>
              {application.status !== "cancelled" && (
                <div className="flex flex-wrap gap-2 sm:shrink-0">
                  {application.status !== "confirmed" && (
                    <form
                      action={updateApplicationStatusAction.bind(
                        null,
                        eventId,
                        application.type,
                        application.id,
                        "confirmed",
                      )}
                    >
                      <Button type="submit" size="sm">
                        確定にする
                      </Button>
                    </form>
                  )}
                  <form
                    action={updateApplicationStatusAction.bind(
                      null,
                      eventId,
                      application.type,
                      application.id,
                      "cancelled",
                    )}
                  >
                    <Button type="submit" variant="outline" size="sm">
                      キャンセルにする
                    </Button>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
