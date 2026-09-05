import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Download, Users } from "lucide-react";
import {
  getEventById,
  listEventApplications,
} from "@/features/events/repository";
import {
  updateApplicationAttendanceAction,
  updateApplicationStatusAction,
} from "@/features/events/actions";
import { requireAdmin } from "@/lib/auth/session";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ApplicationsListSkeleton } from "@/components/layout/detail-skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatJstDateTime } from "@/lib/datetime";

export const metadata: Metadata = {
  title: "イベント申込確認",
};

interface AdminEventPageProps {
  params: Promise<{ eventId: string }>;
}

export default function AdminEventApplicationsPage({
  params,
}: AdminEventPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <Suspense fallback={<ApplicationsListSkeleton />}>
        <ApplicationsList paramsPromise={params} />
      </Suspense>
    </div>
  );
}

async function ApplicationsList({
  paramsPromise,
}: {
  paramsPromise: AdminEventPageProps["params"];
}) {
  // getEventById()は/events/[eventId](ダッシュボード側の公開詳細ページ)とも共有しているため
  // 管理者チェックを内包しない。listEventApplications()側にも管理者チェックはあるが、
  // イベントが存在しない場合はnotFound()がそれより先に走ってしまうため、ここでも明示的に確認する。
  await requireAdmin();

  const { eventId } = await paramsPromise;
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  const applications = await listEventApplications(eventId);
  // 申込者一覧にはキャンセル済みの情報は表示しない(履歴としてはCSV出力側にのみ残す)。
  const visibleApplications = applications.filter(
    (application) => application.status !== "cancelled",
  );
  const attendedCount = visibleApplications.filter(
    (application) => application.attended,
  ).length;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "管理画面", href: "/admin" },
          { label: "イベント管理", href: "/admin/events" },
          { label: event.title },
        ]}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground">
            {event.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              申込者
              <span className="mx-1 text-base font-semibold text-foreground">
                {visibleApplications.length}
              </span>
              人
            </span>
            <span className="text-border">|</span>
            <span>
              参加者
              <span className="mx-1 text-base font-semibold text-foreground">
                {attendedCount}
              </span>
              人
            </span>
          </div>
        </div>
        {applications.length > 0 && (
          <Button asChild variant="outline" size="sm" className="w-fit">
            <Link href={`/api/admin/events/${eventId}/csv`}>
              <Download className="size-3.5" />
              CSV出力
            </Link>
          </Button>
        )}
      </div>

      {visibleApplications.length === 0 ? (
        <EmptyState
          icon={Users}
          title={
            applications.length === 0
              ? "まだ申込はありません。"
              : "現在有効な申込はありません。"
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {visibleApplications.map((application) => (
            <li key={`${application.type}-${application.id}`}>
              <Card className="flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {application.name}
                    </p>
                    <Badge variant="outline">
                      {application.type === "member" ? "会員" : "ゲスト"}
                    </Badge>
                    <Badge variant="info">済</Badge>
                    {application.attended && (
                      <Badge variant="success">参加済み</Badge>
                    )}
                  </div>
                  {(application.companyName || application.title) && (
                    <p className="text-xs text-muted-foreground">
                      {application.companyName ?? "会社名未入力"}
                      {application.title && ` / ${application.title}`}
                    </p>
                  )}
                  {(application.email || application.phone) && (
                    <p className="text-xs text-muted-foreground">
                      {application.email}
                      {application.email && application.phone && " / "}
                      {application.phone}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    申込日時: {formatJstDateTime(application.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:shrink-0">
                  <form
                    action={updateApplicationAttendanceAction.bind(
                      null,
                      eventId,
                      application.type,
                      application.id,
                      !application.attended,
                    )}
                  >
                    <Button
                      type="submit"
                      variant={application.attended ? "outline" : "default"}
                      size="sm"
                    >
                      {application.attended ? "参加を取消" : "参加にする"}
                    </Button>
                  </form>
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
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
