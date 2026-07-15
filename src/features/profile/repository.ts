import "server-only";

import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/auth/session";

export interface ProfileDto {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  title: string | null;
  email: string;
}

export async function getMyProfile(): Promise<ProfileDto> {
  const user = await verifySession();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, title")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    title: data.title,
    email: user.email ?? "",
  };
}

interface UpdateProfileInput {
  displayName: string;
  title?: string;
  avatarUrl?: string;
}

export async function updateMyProfile(input: UpdateProfileInput) {
  const user = await verifySession();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: input.displayName,
      title: input.title || null,
      avatar_url: input.avatarUrl || null,
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
}
