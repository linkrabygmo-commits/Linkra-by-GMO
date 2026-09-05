import "server-only";

import { createClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/datetime";

export interface ActivityItemDto {
  id: string;
  type: "member" | "company" | "event" | "announcement";
  message: string;
  relativeTime: string;
}

interface RawActivity {
  id: string;
  type: ActivityItemDto["type"];
  message: string;
  timestamp: string;
}

// ダッシュボードの「最近のアクティビティ」用。会員登録・企業登録・イベント作成・
// お知らせ公開、それぞれの直近N件を実データから集約し、日時降順にマージする。
// 既読管理のような新しい仕組みは前提にせず、既存のcreated_at/published_atのみを使う。
export async function listRecentActivity(limit = 5): Promise<ActivityItemDto[]> {
  const supabase = await createClient();
  const fetchLimit = limit;

  const [
    { data: profiles, error: profilesError },
    { data: companies, error: companiesError },
    { data: events, error: eventsError },
    { data: announcements, error: announcementsError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, created_at")
      .order("created_at", { ascending: false })
      .limit(fetchLimit),
    supabase
      .from("companies")
      .select("id, name, created_at")
      .order("created_at", { ascending: false })
      .limit(fetchLimit),
    supabase
      .from("events")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(fetchLimit),
    supabase
      .from("announcements")
      .select("id, title, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(fetchLimit),
  ]);

  if (profilesError) throw new Error(profilesError.message);
  if (companiesError) throw new Error(companiesError.message);
  if (eventsError) throw new Error(eventsError.message);
  if (announcementsError) throw new Error(announcementsError.message);

  const raw: RawActivity[] = [
    ...(profiles ?? []).map((row) => ({
      id: `member-${row.id}`,
      type: "member" as const,
      message: `新しい会員「${row.display_name}」さんが登録されました`,
      timestamp: row.created_at,
    })),
    ...(companies ?? []).map((row) => ({
      id: `company-${row.id}`,
      type: "company" as const,
      message: `企業「${row.name}」が登録されました`,
      timestamp: row.created_at,
    })),
    ...(events ?? []).map((row) => ({
      id: `event-${row.id}`,
      type: "event" as const,
      message: `イベント「${row.title}」が作成されました`,
      timestamp: row.created_at,
    })),
    ...(announcements ?? []).map((row) => ({
      id: `announcement-${row.id}`,
      type: "announcement" as const,
      message: `お知らせ「${row.title}」を公開しました`,
      timestamp: row.published_at as string,
    })),
  ];

  return raw
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      type: item.type,
      message: item.message,
      relativeTime: formatRelativeTime(item.timestamp),
    }));
}
