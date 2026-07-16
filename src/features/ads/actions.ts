"use server";

import { revalidatePath } from "next/cache";
import * as repository from "@/features/ads/repository";
import { AdSchema, type AdFormState } from "@/features/ads/schema";

function readAdFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    linkUrl: formData.get("linkUrl"),
    imageUrl: formData.get("imageUrl") || undefined,
    placement: formData.get("placement"),
    startsAt: formData.get("startsAt") || undefined,
    endsAt: formData.get("endsAt") || undefined,
  };
}

export async function createAdAction(
  _prevState: AdFormState,
  formData: FormData,
): Promise<AdFormState> {
  const validatedFields = AdSchema.safeParse(readAdFormData(formData));

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { startsAt, endsAt, ...rest } = validatedFields.data;

  try {
    await repository.createAd({
      ...rest,
      startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
      endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
    });
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "広告の作成に失敗しました。",
    };
  }

  revalidatePath("/admin/ads");
  revalidatePath("/");

  return { status: "success", message: "広告を作成しました。" };
}

export async function updateAdAction(
  adId: string,
  _prevState: AdFormState,
  formData: FormData,
): Promise<AdFormState> {
  const validatedFields = AdSchema.safeParse(readAdFormData(formData));

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { startsAt, endsAt, ...rest } = validatedFields.data;

  try {
    await repository.updateAd(adId, {
      ...rest,
      startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
      endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
    });
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "広告の更新に失敗しました。",
    };
  }

  revalidatePath("/admin/ads");
  revalidatePath("/");

  return { status: "success", message: "広告を更新しました。" };
}

export async function deleteAdAction(adId: string) {
  await repository.deleteAd(adId);
  revalidatePath("/admin/ads");
  revalidatePath("/");
}
