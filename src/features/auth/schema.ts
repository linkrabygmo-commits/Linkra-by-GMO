import * as z from "zod";

export const SignUpSchema = z.object({
  displayName: z
    .string()
    .min(1, { error: "お名前を入力してください。" })
    .max(50, { error: "お名前は50文字以内で入力してください。" })
    .trim(),
  email: z.email({ error: "有効なメールアドレスを入力してください。" }).trim(),
  password: z
    .string()
    .min(8, { error: "8文字以上で入力してください。" })
    .regex(/[a-zA-Z]/, { error: "英字を1文字以上含めてください。" })
    .regex(/[0-9]/, { error: "数字を1文字以上含めてください。" }),
});

export type SignUpFormState =
  | {
      status: "idle" | "error";
      errors?: {
        displayName?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | { status: "success"; message: string }
  | undefined;

export const LoginSchema = z.object({
  email: z.email({ error: "有効なメールアドレスを入力してください。" }).trim(),
  password: z.string().min(1, { error: "パスワードを入力してください。" }),
});

export type LoginFormState =
  | {
      status: "idle" | "error";
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
