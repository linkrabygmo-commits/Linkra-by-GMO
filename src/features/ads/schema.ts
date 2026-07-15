import * as z from "zod";

export const AdPlacementValues = ["top_hero", "sidebar", "inline"] as const;

export const RequestAdSchema = z.object({
  title: z
    .string()
    .min(1, { error: "タイトルを入力してください。" })
    .max(100, { error: "タイトルは100文字以内で入力してください。" })
    .trim(),
  description: z
    .string()
    .max(300, { error: "説明は300文字以内で入力してください。" })
    .trim()
    .optional(),
  linkUrl: z.url({ error: "有効なURLを入力してください。" }),
  imageUrl: z
    .union([z.url({ error: "有効なURLを入力してください。" }), z.literal("")])
    .optional(),
  placement: z.enum(AdPlacementValues, {
    error: "掲載場所を選択してください。",
  }),
});

export type RequestAdFormState =
  | {
      status: "error";
      errors?: {
        title?: string[];
        description?: string[];
        linkUrl?: string[];
        imageUrl?: string[];
        placement?: string[];
      };
      message?: string;
    }
  | { status: "success"; message: string }
  | undefined;
