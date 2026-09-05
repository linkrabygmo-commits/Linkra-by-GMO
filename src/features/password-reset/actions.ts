"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as repository from "@/features/password-reset/repository";
import {
  RequestPasswordResetSchema,
  SetNewPasswordSchema,
  type RequestPasswordResetFormState,
  type SetNewPasswordFormState,
} from "@/features/password-reset/schema";

// 「パスワードを忘れた方」フォームの送信(初回申請・状況再確認どちらも兼ねる)。
export async function requestPasswordResetAction(
  _prevState: RequestPasswordResetFormState,
  formData: FormData,
): Promise<RequestPasswordResetFormState> {
  const validatedFields = RequestPasswordResetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  let result;
  try {
    result = await repository.requestOrCheckPasswordReset(validatedFields.data.email);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "処理に失敗しました。",
    };
  }

  if (result.status === "not_found") {
    return {
      status: "error",
      message: "入力されたメールアドレスに該当する会員が見つかりません。",
    };
  }

  if (result.status === "ready") {
    return {
      status: "ready",
      requestId: result.requestId,
      message: "管理者によってパスワードリセットが承認されました。新しいパスワードを設定してください。",
    };
  }

  return {
    status: "pending",
    message:
      "管理者へリセットを依頼しました。承認までしばらくお待ちください。承認され次第、もう一度このページでメールアドレスを入力すると新しいパスワードを設定できます。",
  };
}

export async function setNewPasswordAction(
  _prevState: SetNewPasswordFormState,
  formData: FormData,
): Promise<SetNewPasswordFormState> {
  const validatedFields = SetNewPasswordSchema.safeParse({
    requestId: formData.get("requestId"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await repository.completePasswordReset(
      validatedFields.data.requestId,
      validatedFields.data.password,
    );
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "設定に失敗しました。",
    };
  }

  redirect("/login?reset=1");
}

export async function approvePasswordResetRequestAction(requestId: string) {
  await repository.approvePasswordResetRequest(requestId);
  revalidatePath("/admin/members");
}
