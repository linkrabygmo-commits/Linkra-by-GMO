"use server";

import { revalidatePath } from "next/cache";
import * as repository from "@/features/ads/repository";
import {
  RequestAdSchema,
  type RequestAdFormState,
} from "@/features/ads/schema";

export async function requestAdAction(
  _prevState: RequestAdFormState,
  formData: FormData,
): Promise<RequestAdFormState> {
  const validatedFields = RequestAdSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    linkUrl: formData.get("linkUrl"),
    imageUrl: formData.get("imageUrl") || undefined,
    placement: formData.get("placement"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await repository.requestAd(validatedFields.data);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "申請に失敗しました。",
    };
  }

  revalidatePath("/advertise");

  return {
    status: "success",
    message: "広告掲載の申請を受け付けました。運営の承認をお待ちください。",
  };
}
