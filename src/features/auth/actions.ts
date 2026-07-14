"use server";

import { redirect } from "next/navigation";
import * as repository from "@/features/auth/repository";
import {
  LoginSchema,
  SignUpSchema,
  type LoginFormState,
  type SignUpFormState,
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

    if (needsEmailConfirmation) {
      return {
        status: "success",
        message:
          "確認メールを送信しました。メール内のリンクからアカウントを有効化してください。",
      };
    }
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "登録に失敗しました。",
    };
  }

  redirect("/dashboard");
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

  redirect("/dashboard");
}

export async function logoutAction() {
  await repository.signOut();
  redirect("/login");
}
