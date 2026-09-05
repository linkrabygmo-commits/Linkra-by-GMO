import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Building2,
  CalendarDays,
  Megaphone,
  Search,
  Users,
} from "lucide-react";
import { getMyProfile } from "@/features/profile/repository";
import { listMyCompanies } from "@/features/companies/repository";
import { getMemberCount } from "@/features/members/repository";
import { getCompanyCount as getCompanyDirectoryCount } from "@/features/companies/repository";
import {
  getUpcomingEventCount,
  listUpcomingEvents,
} from "@/features/events/repository";
import {
  getPublishedAnnouncementCount,
  listPublishedAnnouncements,
} from "@/features/announcements/repository";
import { listRecentActivity } from "@/features/dashboard/repository";
import { formatJstDate, formatJstDateTime } from "@/lib/datetime";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  StatCard,
  STAT_TONE_CLASSES,
  type StatCardTone,
} from "@/components/ui/stat-card";

export default function DashboardHomePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-8 sm:py-8">
      <Suspense fallback={<DashboardHomeSkeleton />}>
        <DashboardHomeContent />
      </Suspense>
    </div>
  );
}

const ACTIVITY_ICONS = {
  member: Users,
  company: Building2,
  event: CalendarDays,
  announcement: Megaphone,
} as const;

// 会員=blue、企業=purple、イベント=green、お知らせ=amberという淡いアクセントカラーの
// 対応を、サマリーカードと最近のアクティビティのアイコン色で揃える。
const ACTIVITY_TONES: Record<keyof typeof ACTIVITY_ICONS, StatCardTone> = {
  member: "blue",
  company: "purple",
  event: "green",
  announcement: "amber",
};

// クイックアクションの枠線・背景も、対応するカテゴリの淡いアクセントカラーで
// 縁取る(会員=blue、企業=purple)。
const QUICK_ACTION_TONE_CLASSES: Record<StatCardTone, string> = {
  blue: "border-blue-200 bg-blue-50/60 text-blue-600 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400",
  purple:
    "border-purple-200 bg-purple-50/60 text-purple-600 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-400",
  green:
    "border-green-200 bg-green-50/60 text-green-600 hover:border-green-300 hover:bg-green-50 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400",
  amber:
    "border-amber-200 bg-amber-50/60 text-amber-600 hover:border-amber-300 hover:bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
};

async function DashboardHomeContent() {
  const [profile, myCompanies] = await Promise.all([
    getMyProfile(),
    listMyCompanies(),
  ]);

  // ログイン経路以外(既存セッションでの直接アクセス等)でも、プロフィール
  // 未設定のまま来た場合は必ず設定画面に誘導する。
  if (!profile.onboarded) {
    redirect("/profile");
  }

  const [
    memberCount,
    companyCount,
    upcomingEventCount,
    upcomingEvents,
    announcementCount,
    latestAnnouncements,
    recentActivity,
  ] = await Promise.all([
    getMemberCount(),
    getCompanyDirectoryCount(),
    getUpcomingEventCount(),
    listUpcomingEvents(3),
    getPublishedAnnouncementCount(),
    listPublishedAnnouncements(3),
    listRecentActivity(5),
  ]);

  const summaryCards: {
    label: string;
    value: number;
    unit: string;
    icon: typeof Users;
    href: string;
    tone: StatCardTone;
  }[] = [
    {
      label: "会員数",
      value: memberCount,
      unit: "人",
      icon: Users,
      href: "/members",
      tone: "blue",
    },
    {
      label: "企業数",
      value: companyCount,
      unit: "社",
      icon: Building2,
      href: "/companies",
      tone: "purple",
    },
    {
      label: "今後のイベント",
      value: upcomingEventCount,
      unit: "件",
      icon: CalendarDays,
      href: "/events",
      tone: "green",
    },
    {
      label: "お知らせ",
      value: announcementCount,
      unit: "件",
      icon: Megaphone,
      href: "/announcements",
      tone: "amber",
    },
  ];

  const quickActions: {
    label: string;
    href: string;
    icon: typeof Search;
    tone: StatCardTone;
  }[] = [
    { label: "会員を検索", href: "/members", icon: Search, tone: "blue" },
    { label: "企業を検索", href: "/companies", icon: Search, tone: "purple" },
  ];

  return (
    <>
      <div className="app-hero relative flex flex-col gap-2 rounded-2xl border border-border px-6 py-8 sm:px-10 sm:py-10">
        <span className="h-1 w-8 rounded-full bg-primary" />
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          ようこそ、{profile.displayName} さん
        </h1>
        <p className="text-sm text-muted-foreground">
          {profile.title
            ? `${profile.title}として、今日もつながりをつくりましょう。`
            : "プロフィールに肩書きを設定できます。"}
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            unit={card.unit}
            icon={card.icon}
            href={card.href}
            tone={card.tone}
          />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="px-5 py-5">
          <CardHeader className="flex-row items-center justify-between px-0">
            <CardTitle className="text-base">最近のアクティビティ</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-0">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                まだアクティビティはありません。
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {recentActivity.map((activity) => {
                  const Icon = ACTIVITY_ICONS[activity.type];
                  return (
                    <li key={activity.id} className="flex items-start gap-3">
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${STAT_TONE_CLASSES[ACTIVITY_TONES[activity.type]]}`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <p className="text-sm text-foreground">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.relativeTime}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="px-5 py-5">
          <CardHeader className="flex-row items-center justify-between px-0">
            <CardTitle className="text-base">今後の予定</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/events">すべて見る</Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-0">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                現在開催予定のイベントはありません。
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:border-foreground/30"
                >
                  <div className="flex w-12 shrink-0 flex-col items-center rounded-md bg-accent px-1 py-1.5 text-accent-foreground">
                    <span className="text-[0.65rem] leading-none">
                      {formatJstDate(event.startsAt, {
                        month: "numeric",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-[0.65rem] leading-none text-muted-foreground">
                      {formatJstDate(event.startsAt, { weekday: "short" })}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">
                      {formatJstDateTime(event.startsAt, {
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="truncate text-sm font-medium text-foreground">
                      {event.title}
                    </p>
                    {event.location && (
                      <p className="truncate text-xs text-muted-foreground">
                        {event.location}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="px-5 py-5">
            <CardHeader className="px-0">
              <CardTitle className="text-base">クイックアクション</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 px-0">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg border px-3 py-4 text-center transition-colors ${QUICK_ACTION_TONE_CLASSES[action.tone]}`}
                >
                  <action.icon className="size-5" />
                  <span className="text-xs font-medium text-foreground">
                    {action.label}
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="px-5 py-5">
            <CardHeader className="flex-row items-center justify-between px-0">
              <CardTitle className="text-base">お知らせ</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/announcements">すべて見る</Link>
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-0">
              {latestAnnouncements.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  まだお知らせはありません。
                </p>
              ) : (
                latestAnnouncements.map((announcement) => (
                  <Link
                    key={announcement.id}
                    href={`/announcements/${announcement.id}`}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <div className="flex min-w-0 flex-col">
                      <p className="truncate text-sm text-foreground">
                        {announcement.title}
                      </p>
                      {announcement.publishedAt && (
                        <p className="text-xs text-muted-foreground">
                          {formatJstDate(announcement.publishedAt)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">所属企業</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/companies">すべての企業を見る</Link>
          </Button>
        </div>

        {myCompanies.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            まだどの企業にも所属していません。
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myCompanies.map((company) => (
              <Link key={company.id} href={`/companies/${company.id}`}>
                <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Building2 className="size-4" />
                      </span>
                      <CardTitle>{company.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      variant={
                        company.role === "owner" ? "default" : "secondary"
                      }
                    >
                      {company.role === "owner"
                        ? "オーナー"
                        : company.role === "admin"
                          ? "管理者"
                          : "メンバー"}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function DashboardHomeSkeleton() {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
