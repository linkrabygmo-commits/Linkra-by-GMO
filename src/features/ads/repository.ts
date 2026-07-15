import "server-only";

import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/auth/session";
import { ForbiddenError } from "@/lib/repository/base";
import type { AdPlacement, AdStatus } from "@/types/database";
import type { HeroBanner } from "@/features/ads/types";

export interface MyAdRequestDto {
  id: string;
  title: string;
  placement: AdPlacement;
  status: AdStatus;
  createdAt: string;
}

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
    title: row.title,
    description: row.description ?? undefined,
    image: row.image_url ?? undefined,
    href: row.link_url,
  }));
}

interface RequestAdInput {
  title: string;
  description?: string;
  linkUrl: string;
  imageUrl?: string;
  placement: AdPlacement;
  startsAt?: string;
  endsAt?: string;
}

export async function requestAd(input: RequestAdInput): Promise<void> {
  const user = await verifySession();
  const supabase = await createClient();

  const { error } = await supabase.from("advertisements").insert({
    title: input.title,
    description: input.description || null,
    link_url: input.linkUrl,
    image_url: input.imageUrl || null,
    placement: input.placement,
    requested_by: user.id,
    starts_at: input.startsAt || null,
    ends_at: input.endsAt || null,
  });

  if (error) {
    // approved/admin以外の会員がRLSに弾かれた場合、分かりやすいメッセージにする
    if (error.code === "42501") {
      throw new ForbiddenError(
        "広告掲載の申請には運営の承認済み会員である必要があります。",
      );
    }
    throw new Error(error.message);
  }
}

export async function listMyAdRequests(): Promise<MyAdRequestDto[]> {
  const user = await verifySession();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("advertisements")
    .select("id, title, placement, status, created_at")
    .eq("requested_by", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    placement: row.placement,
    status: row.status,
    createdAt: row.created_at,
  }));
}
