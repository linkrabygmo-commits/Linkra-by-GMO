import "server-only";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";
import type { AdPlacement } from "@/types/database";

export interface PendingAdDto {
  id: string;
  title: string;
  description: string | null;
  linkUrl: string;
  imageUrl: string | null;
  placement: AdPlacement;
  requestedByName: string;
  createdAt: string;
}

export interface PendingMemberDto {
  id: string;
  displayName: string;
  companyName: string | null;
  industry: string | null;
  createdAt: string;
}

export async function listPendingMembers(): Promise<PendingMemberDto[]> {
  await requireAdmin();
  const supabase = await createClient();

  // adminであっても profiles 本体への直接SELECTは自分の行しか許可していないため
  // (member_directoryのRLS修正の副作用)、他人の行を横断的に見るにはビュー経由にする。
  const { data, error } = await supabase
    .from("member_directory")
    .select("id, display_name, company_name, industry, created_at")
    .eq("member_status", "registered")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    displayName: row.display_name,
    companyName: row.company_name,
    industry: row.industry,
    createdAt: row.created_at,
  }));
}

export async function approveMember(targetId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.rpc("approve_member", {
    target_id: targetId,
  });

  if (error) throw new Error(error.message);
}

export async function listPendingAds(): Promise<PendingAdDto[]> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: ads, error } = await supabase
    .from("advertisements")
    .select("id, title, description, link_url, image_url, placement, requested_by, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  if (!ads || ads.length === 0) return [];

  const { data: requesters, error: requestersError } = await supabase
    .from("member_directory")
    .select("id, display_name")
    .in(
      "id",
      ads.map((ad) => ad.requested_by),
    );

  if (requestersError) throw new Error(requestersError.message);

  const nameById = new Map((requesters ?? []).map((r) => [r.id, r.display_name]));

  return ads.map((ad) => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    linkUrl: ad.link_url,
    imageUrl: ad.image_url,
    placement: ad.placement,
    requestedByName: nameById.get(ad.requested_by) ?? "(不明なユーザー)",
    createdAt: ad.created_at,
  }));
}

export async function approveAd(adId: string): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("advertisements")
    .update({ status: "approved", approved_by: admin.id })
    .eq("id", adId);

  if (error) throw new Error(error.message);
}

export async function rejectAd(adId: string): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("advertisements")
    .update({ status: "rejected", approved_by: admin.id })
    .eq("id", adId);

  if (error) throw new Error(error.message);
}
