import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getMyMemberStatus } from "@/lib/auth/session";

export interface MemberSummaryDto {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  companyName: string | null;
  title: string | null;
  industry: string | null;
}

export interface MemberDetailDto extends MemberSummaryDto {
  phone: string | null;
  address: string | null;
  bio: string | null;
  canOffer: string | null;
  lookingFor: string | null;
  twitterUrl: string | null;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  canViewFull: boolean;
}

function mapSummary(row: {
  id: string;
  display_name: string;
  avatar_url: string | null;
  company_name: string | null;
  title: string | null;
  industry: string | null;
}): MemberSummaryDto {
  return {
    id: row.id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    companyName: row.company_name,
    title: row.title,
    industry: row.industry,
  };
}

export async function listNewMembers(limit = 6): Promise<MemberSummaryDto[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("member_directory")
    .select("id, display_name, avatar_url, company_name, title, industry")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map(mapSummary);
}

export async function listMembers(): Promise<MemberSummaryDto[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("member_directory")
    .select("id, display_name, avatar_url, company_name, title, industry")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map(mapSummary);
}

export async function getMemberById(
  id: string,
): Promise<MemberDetailDto | null> {
  const [user, myStatus] = await Promise.all([
    getCurrentUser(),
    getMyMemberStatus(),
  ]);
  const canViewFull =
    user?.id === id || myStatus === "approved" || myStatus === "admin";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("member_directory")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const snsLinks = data.sns_links ?? {};

  return {
    id: data.id,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    companyName: data.company_name,
    title: data.title,
    industry: data.industry,
    phone: data.phone,
    address: data.address,
    bio: data.bio,
    canOffer: data.can_offer,
    lookingFor: data.looking_for,
    twitterUrl: snsLinks.twitter ?? null,
    facebookUrl: snsLinks.facebook ?? null,
    linkedinUrl: snsLinks.linkedin ?? null,
    canViewFull,
  };
}
