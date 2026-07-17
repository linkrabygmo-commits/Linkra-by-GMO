"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as repository from "@/features/profile/repository";
import {
  UpdateProfileSchema,
  type UpdateProfileFormState,
} from "@/features/profile/schema";
import { COMPANY_NONE_VALUE } from "@/features/profile/components/company-select-field";

export async function updateProfileAction(
  _prevState: UpdateProfileFormState,
  formData: FormData,
): Promise<UpdateProfileFormState> {
  const rawCompanyId = formData.get("companyId");
  const companyId =
    !rawCompanyId || rawCompanyId === COMPANY_NONE_VALUE ? undefined : rawCompanyId;

  const validatedFields = UpdateProfileSchema.safeParse({
    displayName: formData.get("displayName"),
    title: formData.get("title") || undefined,
    avatarUrl: formData.get("avatarUrl") || undefined,
    companyId,
    industry: formData.get("industry") || undefined,
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
    bio: formData.get("bio") || undefined,
    canOffer: formData.get("canOffer") || undefined,
    lookingFor: formData.get("lookingFor") || undefined,
    twitterUrl: formData.get("twitterUrl") || undefined,
    facebookUrl: formData.get("facebookUrl") || undefined,
    linkedinUrl: formData.get("linkedinUrl") || undefined,
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  let wasFirstSave = false;

  try {
    const result = await repository.updateMyProfile(validatedFields.data);
    wasFirstSave = result.wasFirstSave;
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "更新に失敗しました。",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  // 会員登録後、初めてのプロフィール保存はダッシュボードに進む。
  // 2回目以降の編集はこのままこの画面に留まり、保存メッセージだけ出す。
  if (wasFirstSave) {
    redirect("/dashboard");
  }

  return { status: "success", message: "プロフィールを更新しました。" };
}
