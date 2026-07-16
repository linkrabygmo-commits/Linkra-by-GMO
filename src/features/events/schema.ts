import * as z from "zod";

export const EventAudienceValues = ["public", "member_only"] as const;

const isValidDate = (value: string) => !Number.isNaN(new Date(value).getTime());

export const EventSchema = z.object({
  title: z
    .string()
    .min(1, { error: "タイトルを入力してください。" })
    .max(100, { error: "タイトルは100文字以内で入力してください。" })
    .trim(),
  description: z
    .string()
    .max(2000, { error: "説明は2000文字以内で入力してください。" })
    .trim()
    .optional(),
  coverImageUrl: z
    .union([z.url({ error: "有効なURLを入力してください。" }), z.literal("")])
    .optional(),
  audience: z.enum(EventAudienceValues, { error: "公開範囲を選択してください。" }),
  location: z
    .string()
    .max(200, { error: "開催場所は200文字以内で入力してください。" })
    .trim()
    .optional(),
  startsAt: z
    .string()
    .min(1, { error: "開始日時を入力してください。" })
    .refine(isValidDate, { error: "有効な開始日時を入力してください。" }),
  endsAt: z
    .union([z.string().refine(isValidDate, { error: "有効な終了日時を入力してください。" }), z.literal("")])
    .optional(),
  capacity: z.coerce
    .number({ error: "定員は数値で入力してください。" })
    .int()
    .positive({ error: "定員は1以上で入力してください。" })
    .optional(),
});

export type EventFormState =
  | {
      status: "error";
      errors?: {
        title?: string[];
        description?: string[];
        coverImageUrl?: string[];
        audience?: string[];
        location?: string[];
        startsAt?: string[];
        endsAt?: string[];
        capacity?: string[];
      };
      message?: string;
    }
  | { status: "success"; message: string }
  | undefined;

export const GuestEventApplicationSchema = z.object({
  name: z
    .string()
    .min(1, { error: "お名前を入力してください。" })
    .max(100, { error: "お名前は100文字以内で入力してください。" })
    .trim(),
  email: z.email({ error: "有効なメールアドレスを入力してください。" }),
  phone: z
    .string()
    .max(30, { error: "電話番号は30文字以内で入力してください。" })
    .trim()
    .optional(),
});

export type GuestEventApplicationFormState =
  | {
      status: "error";
      errors?: {
        name?: string[];
        email?: string[];
        phone?: string[];
      };
      message?: string;
    }
  | { status: "success"; message: string }
  | undefined;
