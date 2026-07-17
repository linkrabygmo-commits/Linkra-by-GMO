"use server";

import { redirect } from "next/navigation";
import * as repository from "@/features/auth/repository";
import { getMyOnboardedStatus } from "@/features/profile/repository";
import {
  LoginSchema,
  SignUpSchema,
  RequestPasswordResetSchema,
  ResetPasswordSchema,
  type LoginFormState,
  type SignUpFormState,
  type RequestPasswordResetFormState,
  type ResetPasswordFormState,
} from "@/features/auth/schema";

export async function signUpAction(
  _prevState: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  const validatedFields = SignUpSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { needsEmailConfirmation } = await repository.signUp(
      validatedFields.data,
    );

    // メール確認が無効な場合はsignUp直後にセッションが張られるが、登録後は
    // 必ずログイン画面から会員自身にログインしてもらう導線に統一するため、
    // 一旦サインアウトしておく。
    if (!needsEmailConfirmation) {
      await repository.signOut();
    }
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "登録に失敗しました。",
    };
  }

  redirect("/login?registered=1");
}

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await repository.signIn(validatedFields.data);
  } catch {
    return {
      status: "error",
      message: "メールアドレスまたはパスワードが正しくありません。",
    };
  }

  // 初回ログイン(まだプロフィール未設定)ならプロフィール設定画面へ、
  // 設定済みならそのままダッシュボードへ。
  const onboarded = await getMyOnboardedStatus();
  redirect(onboarded ? "/dashboard" : "/profile");
}

export async function logoutAction() {
  await repository.signOut();
  redirect("/login");
}

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

  try {
    await repository.requestPasswordReset(validatedFields.data.email);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "送信に失敗しました。",
    };
  }

  return {
    status: "success",
    message:
      "パスワード再設定用のメールを送信しました。メール内のリンクから新しいパスワードを設定してください。",
  };
}

export async function updatePasswordAction(
  _prevState: ResetPasswordFormState,
  formData: FormData,
): Promise<ResetPasswordFormState> {
  const validatedFields = ResetPasswordSchema.safeParse({
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await repository.updatePassword(validatedFields.data.password);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "更新に失敗しました。",
    };
  }

  redirect("/dashboard");
}
