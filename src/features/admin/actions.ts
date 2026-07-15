"use server";

import { revalidatePath } from "next/cache";
import * as repository from "@/features/admin/repository";

export async function approveMemberAction(targetId: string) {
  await repository.approveMember(targetId);
  revalidatePath("/admin/members");
}
