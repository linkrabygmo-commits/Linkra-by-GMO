import "server-only";

import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/auth/session";
import type { MemberStatus } from "@/types/database";

export interface ProfileDto {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  title: string | null;
  email: string;
  memberStatus: MemberStatus;
  companyName: string | null;
  industry: string | null;
  phone: string | null;
  address: string | null;
  bio: string | null;
  canOffer: string | null;
  lookingFor: string | null;
  twitterUrl: string | null;
  facebookUrl: string | null;
  linkedinUrl: string | null;
}

export async function getMyProfile(): Promise<ProfileDto> {
  const user = await verifySession();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, display_name, avatar_url, title, member_status, company_name, industry, phone, address, bio, can_offer, looking_for, sns_links",
    )
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);

  const snsLinks = data.sns_links ?? {};

  return {
    id: data.id,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    title: data.title,
    email: user.email ?? "",
    memberStatus: data.member_status,
    companyName: data.company_name,
    industry: data.industry,
    phone: data.phone,
    address: data.address,
    bio: data.bio,
    canOffer: data.can_offer,
    lookingFor: data.looking_for,
    twitterUrl: snsLinks.twitter ?? null,
    facebookUrl: snsLinks.facebook ?? null,
    linkedinUrl: snsLinks.linkedin ?? null,
  };
}

interface UpdateProfileInput {
  displayName: string;
  title?: string;
  avatarUrl?: string;
  companyName?: string;
  industry?: string;
  phone?: string;
  address?: string;
  bio?: string;
  canOffer?: string;
  lookingFor?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
}

export async function updateMyProfile(input: UpdateProfileInput) {
  const user = await verifySession();
  const supabase = await createClient();

  const snsLinks: Record<string, string> = {};
  if (input.twitterUrl) snsLinks.twitter = input.twitterUrl;
  if (input.facebookUrl) snsLinks.facebook = input.facebookUrl;
  if (input.linkedinUrl) snsLinks.linkedin = input.linkedinUrl;

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: input.displayName,
      title: input.title || null,
      avatar_url: input.avatarUrl || null,
      company_name: input.companyName || null,
      industry: input.industry || null,
      phone: input.phone || null,
      address: input.address || null,
      bio: input.bio || null,
      can_offer: input.canOffer || null,
      looking_for: input.lookingFor || null,
      sns_links: Object.keys(snsLinks).length > 0 ? snsLinks : null,
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
}
