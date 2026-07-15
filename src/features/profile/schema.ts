import * as z from "zod";

export const UpdateProfileSchema = z.object({
  displayName: z
    .string()
    .min(1, { error: "お名前を入力してください。" })
    .max(50, { error: "お名前は50文字以内で入力してください。" })
    .trim(),
  title: z
    .string()
    .max(100, { error: "肩書きは100文字以内で入力してください。" })
    .trim()
    .optional(),
  avatarUrl: z
    .union([z.url({ error: "有効なURLを入力してください。" }), z.literal("")])
    .optional(),
});

export type UpdateProfileFormState =
  | {
      status: "error";
      errors?: {
        displayName?: string[];
        title?: string[];
        avatarUrl?: string[];
      };
      message?: string;
    }
  | { status: "success"; message: string }
  | undefined;
