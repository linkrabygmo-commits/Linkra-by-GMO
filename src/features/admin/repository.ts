import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";
import { ForbiddenError } from "@/lib/repository/base";
import type { MemberStatus } from "@/types/database";

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
