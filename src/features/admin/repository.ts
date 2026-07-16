import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";
import { ForbiddenError } from "@/lib/repository/base";
import type { MemberStatus } from "@/types/database";

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

export interface MemberDto {
  id: string;
  displayName: string;
  companyName: string | null;
  memberStatus: MemberStatus;
  createdAt: string;
}

export async function listAllMembers(): Promise<MemberDto[]> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("member_directory")
    .select("id, display_name, company_name, member_status, created_at")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    displayName: row.display_name,
    companyName: row.company_name,
    memberStatus: row.member_status,
    createdAt: row.created_at,
  }));
}

export async function updateMemberStatus(
  targetId: string,
  status: MemberStatus,
): Promise<void> {
  const admin = await requireAdmin();

  if (targetId === admin.id) {
    throw new ForbiddenError("自分自身のステータスは変更できません。");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("set_member_status", {
    target_id: targetId,
    new_status: status,
  });

  if (error) throw new Error(error.message);
}

export async function deleteMember(targetId: string): Promise<void> {
  const admin = await requireAdmin();

  if (targetId === admin.id) {
    throw new ForbiddenError("自分自身のアカウントは削除できません。");
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(targetId);

  if (error) throw new Error(error.message);
}
