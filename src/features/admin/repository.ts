import "server-only";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";

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
