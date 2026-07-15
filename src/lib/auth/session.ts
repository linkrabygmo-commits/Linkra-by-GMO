import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MemberStatus } from "@/types/database";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
});

export const verifySession = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
});

// ログイン中なら自分自身のmember_statusを返す(未ログインならnull)。
// 会員ディレクトリのマスキング判定(自分がapproved/admin/本人か)に使う。
export const getMyMemberStatus = cache(
  async (): Promise<MemberStatus | null> => {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("member_status")
      .eq("id", user.id)
      .single();

    return data?.member_status ?? null;
  },
);

export const requireAdmin = cache(async () => {
  const user = await verifySession();
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("member_status")
    .eq("id", user.id)
    .single();

  if (data?.member_status !== "admin") {
    redirect("/dashboard");
  }

  return user;
});
