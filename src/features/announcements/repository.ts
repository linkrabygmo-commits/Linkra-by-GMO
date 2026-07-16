import "server-only";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";
import type { AnnouncementStatus } from "@/types/database";

export interface AnnouncementDto {
  id: string;
  title: string;
  body: string;
  coverImageUrl: string | null;
  status: AnnouncementStatus;
  publishedAt: string | null;
  createdAt: string;
}

interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  cover_image_url: string | null;
  status: AnnouncementStatus;
  published_at: string | null;
  created_at: string;
}

function toAnnouncementDto(row: AnnouncementRow): AnnouncementDto {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    coverImageUrl: row.cover_image_url,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

const ANNOUNCEMENT_COLUMNS = "id, title, body, cover_image_url, status, published_at, created_at";

export async function listPublishedAnnouncements(limit?: number): Promise<AnnouncementDto[]> {
  const supabase = await createClient();
  let query = supabase
    .from("announcements")
    .select(ANNOUNCEMENT_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map(toAnnouncementDto);
}

export async function getPublishedAnnouncementById(
  announcementId: string,
): Promise<AnnouncementDto | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select(ANNOUNCEMENT_COLUMNS)
    .eq("id", announcementId)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? toAnnouncementDto(data) : null;
}

export async function listAllAnnouncementsForAdmin(): Promise<AnnouncementDto[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select(ANNOUNCEMENT_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(toAnnouncementDto);
}

export async function getAnnouncementByIdForAdmin(
  announcementId: string,
): Promise<AnnouncementDto | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select(ANNOUNCEMENT_COLUMNS)
    .eq("id", announcementId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? toAnnouncementDto(data) : null;
}

export interface AnnouncementInput {
  title: string;
  body: string;
  coverImageUrl?: string;
  status: AnnouncementStatus;
}

export async function createAnnouncement(input: AnnouncementInput): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("announcements").insert({
    title: input.title,
    body: input.body,
    cover_image_url: input.coverImageUrl || null,
    status: input.status,
    published_at: input.status === "published" ? new Date().toISOString() : null,
    created_by: admin.id,
  });

  if (error) throw new Error(error.message);
}

export async function updateAnnouncement(
  announcementId: string,
  input: AnnouncementInput,
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: current, error: fetchError } = await supabase
    .from("announcements")
    .select("status, published_at")
    .eq("id", announcementId)
    .maybeSingle();
  if (fetchError) throw new Error(fetchError.message);

  let publishedAt: string | null = null;
  if (input.status === "published") {
    publishedAt =
      current?.status === "published" && current.published_at
        ? current.published_at
        : new Date().toISOString();
  }

  const { error } = await supabase
    .from("announcements")
    .update({
      title: input.title,
      body: input.body,
      cover_image_url: input.coverImageUrl || null,
      status: input.status,
      published_at: publishedAt,
    })
    .eq("id", announcementId);

  if (error) throw new Error(error.message);
}

export async function deleteAnnouncement(announcementId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", announcementId);
  if (error) throw new Error(error.message);
}
