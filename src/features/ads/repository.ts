import "server-only";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";
import type { AdPlacement, AdStatus } from "@/types/database";
import type { HeroBanner } from "@/features/ads/types";

export async function listActiveAds(
  placement: AdPlacement,
): Promise<HeroBanner[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("advertisements")
    .select("title, description, image_url, link_url")
    .eq("placement", placement)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    title: row.title ?? undefined,
    description: row.description ?? undefined,
    image: row.image_url ?? undefined,
    href: row.link_url,
  }));
}

export interface AdDto {
  id: string;
  title: string | null;
  description: string | null;
  linkUrl: string;
  imageUrl: string | null;
  placement: AdPlacement;
  status: AdStatus;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
}

const AD_COLUMNS =
  "id, title, description, link_url, image_url, placement, status, starts_at, ends_at, created_at";

interface AdRow {
  id: string;
  title: string | null;
  description: string | null;
  link_url: string;
  image_url: string | null;
  placement: AdPlacement;
  status: AdStatus;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

function toAdDto(row: AdRow): AdDto {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    linkUrl: row.link_url,
    imageUrl: row.image_url,
    placement: row.placement,
    status: row.status,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    createdAt: row.created_at,
  };
}

export async function listAllAdsForAdmin(): Promise<AdDto[]> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("advertisements")
    .select(AD_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map(toAdDto);
}

export async function getAdByIdForAdmin(adId: string): Promise<AdDto | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("advertisements")
    .select(AD_COLUMNS)
    .eq("id", adId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return toAdDto(data);
}

// 広告はタイトル/説明文/掲載場所を持たず、画像とリンク先URLのみで完結する
// バナー広告として作成する(掲載場所は常にトップページのみのためハードコード)。
export interface AdInput {
  linkUrl: string;
  imageUrl: string;
  startsAt?: string;
  endsAt?: string;
}

export async function createAd(input: AdInput): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("advertisements").insert({
    link_url: input.linkUrl,
    image_url: input.imageUrl,
    placement: "top_hero",
    status: "approved",
    requested_by: admin.id,
    approved_by: admin.id,
    starts_at: input.startsAt || null,
    ends_at: input.endsAt || null,
  });

  if (error) throw new Error(error.message);
}

export async function updateAd(adId: string, input: AdInput): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("advertisements")
    .update({
      link_url: input.linkUrl,
      image_url: input.imageUrl,
      starts_at: input.startsAt || null,
      ends_at: input.endsAt || null,
    })
    .eq("id", adId);

  if (error) throw new Error(error.message);
}

export async function deleteAd(adId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("advertisements").delete().eq("id", adId);

  if (error) throw new Error(error.message);
}
