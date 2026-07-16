"use server";

import { revalidatePath } from "next/cache";
import * as repository from "@/features/admin/repository";
import type { MemberStatus } from "@/types/database";

export async function approveMemberAction(targetId: string) {
  await repository.approveMember(targetId);
  revalidatePath("/admin/members");
}

export async function updateMemberStatusAction(targetId: string, status: MemberStatus) {
  await repository.updateMemberStatus(targetId, status);
  revalidatePath("/admin/members");
}

export async function deleteMemberAction(targetId: string) {
  await repository.deleteMember(targetId);
  revalidatePath("/admin/members");
}
