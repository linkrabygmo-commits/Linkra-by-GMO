"use server";

import { revalidatePath } from "next/cache";
import * as repository from "@/features/admin/repository";

export async function approveMemberAction(targetId: string) {
  await repository.approveMember(targetId);
  revalidatePath("/admin/members");
}

export async function approveAdAction(adId: string) {
  await repository.approveAd(adId);
  revalidatePath("/admin/ads");
  revalidatePath("/");
  revalidatePath("/advertise");
}

export async function rejectAdAction(adId: string) {
  await repository.rejectAd(adId);
  revalidatePath("/admin/ads");
  revalidatePath("/advertise");
}
