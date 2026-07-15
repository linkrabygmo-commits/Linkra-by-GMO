"use server";

import { revalidatePath } from "next/cache";
import * as repository from "@/features/profile/repository";
import {
  UpdateProfileSchema,
  type UpdateProfileFormState,
} from "@/features/profile/schema";

export async function updateProfileAction(
  _prevState: UpdateProfileFormState,
  formData: FormData,
): Promise<UpdateProfileFormState> {
  const validatedFields = UpdateProfileSchema.safeParse({
    displayName: formData.get("displayName"),
    title: formData.get("title") || undefined,
    avatarUrl: formData.get("avatarUrl") || undefined,
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await repository.updateMyProfile(validatedFields.data);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "更新に失敗しました。",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { status: "success", message: "プロフィールを更新しました。" };
}
