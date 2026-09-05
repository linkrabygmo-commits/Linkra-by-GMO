import * as z from "zod";

export const RequestPasswordResetSchema = z.object({
  email: z.email({ error: "有効なメールアドレスを入力してください。" }).trim(),
});

export type RequestPasswordResetFormState =
  | {
      status: "error";
      errors?: { email?: string[] };
      message?: string;
    }
  // requestId が入っている場合は「承認済み、新しいパスワードを設定できる」状態。
  | { status: "pending"; message: string }
  | { status: "ready"; requestId: string; message: string }
  | undefined;

export const SetNewPasswordSchema = z
  .object({
    requestId: z.uuid(),
    password: z
      .string()
      .min(8, { error: "8文字以上で入力してください。" })
      .regex(/[a-zA-Z]/, { error: "英字を1文字以上含めてください。" })
      .regex(/[0-9]/, { error: "数字を1文字以上含めてください。" }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: "パスワードが一致しません。",
    path: ["passwordConfirm"],
  });

export type SetNewPasswordFormState =
  | {
      status: "error";
      errors?: { password?: string[]; passwordConfirm?: string[] };
      message?: string;
    }
  | undefined;
