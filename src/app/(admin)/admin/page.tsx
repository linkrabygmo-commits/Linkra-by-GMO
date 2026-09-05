import { Suspense } from "react";
import Link from "next/link";
import { CalendarDays, Image as ImageIcon, Megaphone, Users } from "lucide-react";
import { listAllMembers } from "@/features/admin/repository";
import { getAdCount } from "@/features/ads/repository";
import { getUpcomingEventCount } from "@/features/events/repository";
import { getPublishedAnnouncementCount } from "@/features/announcements/repository";
import { Card } from "@/components/ui/card";

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-8 sm:px-10 sm:py-10">
      <div className="app-hero flex flex-col gap-2 rounded-2xl border border-border px-8 py-10 sm:px-10">
        <span className="h-1 w-8 rounded-full bg-primary" />
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          管理画面
        </h1>
        <p className="text-sm text-muted-foreground">
          会員・広告・イベント・お知らせの運営状況をここから確認できます。
        </p>
      </div>
      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewContent />
      </Suspense>
    </div>
  );
}

async function OverviewContent() {
  const [members, adCount, upcomingEventCount, announcementCount] = await Promise.all([
    listAllMembers(),
    getAdCount(),
    getUpcomingEventCount(),
    getPublishedAnnouncementCount(),
  ]);

  const cards = [
    { label: "会員数", value: members.length, unit: "人", icon: Users, href: "/admin/members" },
    { label: "広告", value: adCount, unit: "件", icon: ImageIcon, href: "/admin/ads" },
    {
      label: "今後のイベント",
      value: upcomingEventCount,
      unit: "件",
      icon: CalendarDays,
      href: "/admin/events",
    },
    {
      label: "お知らせ",
      value: announcementCount,
      unit: "件",
      icon: Megaphone,
      href: "/admin/announcements",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.label} href={card.href}>
          <Card className="gap-3 px-5 py-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <card.icon className="size-5" />
              </span>
              <span className="text-sm text-muted-foreground">{card.label}</span>
            </div>
            <p className="text-3xl font-semibold text-foreground">
              {card.value}
              <span className="ml-1 text-base font-normal text-muted-foreground">
                {card.unit}
              </span>
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}
