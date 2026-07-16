import * as z from "zod";

const isValidDate = (value: string) => !Number.isNaN(new Date(value).getTime());

export const AdSchema = z.object({
  linkUrl: z.url({ error: "有効なURLを入力してください。" }),
  imageUrl: z.url({ error: "広告画像をアップロードしてください。" }),
  startsAt: z
    .union([z.string().refine(isValidDate, { error: "有効な開始日時を入力してください。" }), z.literal("")])
    .optional(),
  endsAt: z
    .union([z.string().refine(isValidDate, { error: "有効な終了日時を入力してください。" }), z.literal("")])
    .optional(),
});

export type AdFormState =
  | {
      status: "error";
      errors?: {
        linkUrl?: string[];
        imageUrl?: string[];
        startsAt?: string[];
        endsAt?: string[];
      };
      message?: string;
    }
  | { status: "success"; message: string }
  | undefined;
