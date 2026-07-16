import * as z from "zod";

export const AnnouncementStatusValues = ["draft", "published"] as const;

export const AnnouncementSchema = z.object({
  title: z
    .string()
    .min(1, { error: "タイトルを入力してください。" })
    .max(100, { error: "タイトルは100文字以内で入力してください。" })
    .trim(),
  body: z
    .string()
    .min(1, { error: "本文を入力してください。" })
    .max(5000, { error: "本文は5000文字以内で入力してください。" })
    .trim(),
  coverImageUrl: z
    .union([z.url({ error: "有効なURLを入力してください。" }), z.literal("")])
    .optional(),
  status: z.enum(AnnouncementStatusValues, { error: "公開状態を選択してください。" }),
});

export type AnnouncementFormState =
  | {
      status: "error";
      errors?: {
        title?: string[];
        body?: string[];
        coverImageUrl?: string[];
        status?: string[];
      };
      message?: string;
    }
  | { status: "success"; message: string }
  | undefined;
