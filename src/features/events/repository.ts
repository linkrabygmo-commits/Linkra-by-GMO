import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, verifySession, requireAdmin } from "@/lib/auth/session";
import { ForbiddenError } from "@/lib/repository/base";
import type { EventAudience, EventApplicationStatus } from "@/types/database";

export interface EventDto {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  audience: EventAudience;
  location: string | null;
  startsAt: string;
  endsAt: string | null;
  capacity: number | null;
  applicationDeadline: string | null;
}

export interface EventDetailDto extends EventDto {
  appliedCount: number;
  myApplicationStatus: EventApplicationStatus | null;
  isPastDeadline: boolean;
}

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  audience: EventAudience;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  capacity: number | null;
  application_deadline: string | null;
}

function toEventDto(row: EventRow): EventDto {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    audience: row.audience,
    location: row.location,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    capacity: row.capacity,
    applicationDeadline: row.application_deadline,
  };
}

const EVENT_COLUMNS =
  "id, title, description, cover_image_url, audience, location, starts_at, ends_at, capacity, application_deadline";

function isPastDeadline(applicationDeadline: string | null): boolean {
  return applicationDeadline != null && new Date(applicationDeadline).getTime() < Date.now();
}

export async function listEvents(): Promise<EventDto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .order("starts_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map(toEventDto);
}

export async function getEventById(eventId: string): Promise<EventDetailDto | null> {
  const supabase = await createClient();
  const { data: event, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("id", eventId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!event) return null;

  const [{ count: memberCount }, { count: guestCount }] = await Promise.all([
    supabase
      .from("member_event_applications")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId)
      .neq("status", "cancelled"),
    supabase
      .from("guest_event_applications")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId)
      .neq("status", "cancelled"),
  ]);

  const user = await getCurrentUser();
  let myApplicationStatus: EventApplicationStatus | null = null;

  if (user) {
    // キャンセル後の再申込を許可しているため、同一イベント・同一会員の申込行が
    // 複数(キャンセル済みの履歴+最新の申込)存在し得る。表示すべきは常に最新の1件。
    const { data: myApplications } = await supabase
      .from("member_event_applications")
      .select("status")
      .eq("event_id", eventId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    myApplicationStatus = myApplications?.[0]?.status ?? null;
  }

  return {
    ...toEventDto(event),
    appliedCount: (memberCount ?? 0) + (guestCount ?? 0),
    myApplicationStatus,
    // Date.now()はReactコンポーネントのレンダー本体内で直接呼ぶとpurityルールに反するため、
    // ここ(リポジトリ層)で判定済みの真偽値としてDTOに含めて返す。
    isPastDeadline: isPastDeadline(event.application_deadline),
  };
}

export async function applyAsMember(eventId: string): Promise<void> {
  const user = await verifySession();
  const supabase = await createClient();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("application_deadline")
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) throw new Error(eventError.message);
  if (!event) throw new Error("イベントが見つかりません。");
  if (isPastDeadline(event.application_deadline)) {
    throw new ForbiddenError("回答期限を過ぎたため、参加申込を締め切りました。");
  }

  // 過去にキャンセルした申込の履歴は残したまま、新規の行として再申込を作成する。
  // 同時にアクティブ(未キャンセル)な申込は1人1件までというルールはDB側の
  // partial unique index (member_event_applications_active_unique) でも担保している。
  // 管理者による「確定」作業は不要にしたため、申込時点でconfirmed扱いにする。
  const { error } = await supabase.from("member_event_applications").insert({
    event_id: eventId,
    user_id: user.id,
    status: "confirmed",
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("すでにこのイベントに申し込み済みです。");
    }
    throw new Error(error.message);
  }
}

export async function cancelMyApplication(eventId: string): Promise<void> {
  const user = await verifySession();
  const supabase = await createClient();

  // 履歴として残っている過去のキャンセル済み行は変更せず、現在アクティブな申込のみを
  // キャンセルする(複数行が存在し得るため、statusで対象を絞る)。
  const { error } = await supabase
    .from("member_event_applications")
    .update({ status: "cancelled" })
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .neq("status", "cancelled");

  if (error) throw new Error(error.message);
}

interface GuestApplicationInput {
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  companyName: string;
  title: string;
}

export async function applyAsGuest(input: GuestApplicationInput): Promise<void> {
  const supabase = await createClient();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("audience, application_deadline")
    .eq("id", input.eventId)
    .maybeSingle();

  if (eventError) throw new Error(eventError.message);
  if (!event) throw new Error("イベントが見つかりません。");
  if (event.audience !== "public") {
    throw new ForbiddenError(
      "このイベントはゲスト参加を受け付けていません。会員登録のうえお申し込みください。",
    );
  }
  if (isPastDeadline(event.application_deadline)) {
    throw new ForbiddenError("回答期限を過ぎたため、参加申込を締め切りました。");
  }

  // 管理者による「確定」作業は不要にしたため、申込時点でconfirmed扱いにする。
  const { error } = await supabase.from("guest_event_applications").insert({
    event_id: input.eventId,
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    company_name: input.companyName,
    title: input.title,
    status: "confirmed",
  });

  if (error) throw new Error(error.message);
}

export interface EventApplicationDto {
  id: string;
  type: "member" | "guest";
  name: string;
  companyName: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  status: EventApplicationStatus;
  createdAt: string;
}

export async function listEventApplications(eventId: string): Promise<EventApplicationDto[]> {
  await requireAdmin();
  const supabase = await createClient();

  const [
    { data: memberApps, error: memberError },
    { data: guestApps, error: guestError },
  ] = await Promise.all([
    supabase
      .from("member_event_applications")
      .select("id, user_id, status, created_at")
      .eq("event_id", eventId),
    supabase
      .from("guest_event_applications")
      .select("id, name, email, phone, company_name, title, status, created_at")
      .eq("event_id", eventId),
  ]);

  if (memberError) throw new Error(memberError.message);
  if (guestError) throw new Error(guestError.message);

  let memberById = new Map<string, { displayName: string; companyName: string | null; title: string | null }>();

  if (memberApps && memberApps.length > 0) {
    const { data: members, error } = await supabase
      .from("member_directory")
      .select("id, display_name, company_name, title")
      .in(
        "id",
        memberApps.map((application) => application.user_id),
      );

    if (error) throw new Error(error.message);
    memberById = new Map(
      (members ?? []).map((member) => [
        member.id,
        { displayName: member.display_name, companyName: member.company_name, title: member.title },
      ]),
    );
  }

  const memberDtos: EventApplicationDto[] = (memberApps ?? []).map((application) => {
    const member = memberById.get(application.user_id);
    return {
      id: application.id,
      type: "member",
      name: member?.displayName ?? "(不明な会員)",
      companyName: member?.companyName ?? null,
      title: member?.title ?? null,
      email: null,
      phone: null,
      status: application.status,
      createdAt: application.created_at,
    };
  });

  const guestDtos: EventApplicationDto[] = (guestApps ?? []).map((application) => ({
    id: application.id,
    type: "guest",
    name: application.name,
    companyName: application.company_name,
    title: application.title,
    email: application.email,
    phone: application.phone,
    status: application.status,
    createdAt: application.created_at,
  }));

  return [...memberDtos, ...guestDtos].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function updateApplicationStatus(
  applicationType: "member" | "guest",
  applicationId: string,
  status: EventApplicationStatus,
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const table =
    applicationType === "member" ? "member_event_applications" : "guest_event_applications";

  const { error } = await supabase.from(table).update({ status }).eq("id", applicationId);

  if (error) throw new Error(error.message);
}

export interface EventInput {
  title: string;
  description?: string;
  coverImageUrl?: string;
  audience: EventAudience;
  location?: string;
  startsAt: string;
  endsAt?: string;
  capacity?: number;
  applicationDeadline?: string;
}

export async function listAllEventsForAdmin(): Promise<EventDto[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .order("starts_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map(toEventDto);
}

export async function createEvent(input: EventInput): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("events").insert({
    title: input.title,
    description: input.description || null,
    cover_image_url: input.coverImageUrl || null,
    audience: input.audience,
    location: input.location || null,
    starts_at: input.startsAt,
    ends_at: input.endsAt || null,
    capacity: input.capacity ?? null,
    application_deadline: input.applicationDeadline || null,
    created_by: admin.id,
  });

  if (error) throw new Error(error.message);
}

export async function updateEvent(eventId: string, input: EventInput): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .update({
      title: input.title,
      description: input.description || null,
      cover_image_url: input.coverImageUrl || null,
      audience: input.audience,
      location: input.location || null,
      starts_at: input.startsAt,
      ends_at: input.endsAt || null,
      capacity: input.capacity ?? null,
      application_deadline: input.applicationDeadline || null,
    })
    .eq("id", eventId);

  if (error) throw new Error(error.message);
}

export async function deleteEvent(eventId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) throw new Error(error.message);
}
