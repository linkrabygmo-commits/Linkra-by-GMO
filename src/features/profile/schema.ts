import * as z from "zod";

const optionalText = (max: number, label: string) =>
  z
    .string()
    .max(max, { error: `${label}は${max}文字以内で入力してください。` })
    .trim()
    .optional();

const requiredText = (max: number, label: string) =>
  z
    .string()
    .min(1, { error: `${label}を入力してください。` })
    .max(max, { error: `${label}は${max}文字以内で入力してください。` })
    .trim();

const optionalUrl = z
  .union([z.url({ error: "有効なURLを入力してください。" }), z.literal("")])
  .optional();

export const UpdateProfileSchema = z.object({
  displayName: z
    .string()
    .min(1, { error: "お名前を入力してください。" })
    .max(50, { error: "お名前は50文字以内で入力してください。" })
    .trim(),
  title: requiredText(100, "役職"),
  avatarUrl: optionalUrl,
  companyId: z.uuid({ error: "会社名を選択してください。" }),
  industry: requiredText(50, "業種"),
  phone: requiredText(30, "電話番号"),
  address: optionalText(200, "住所"),
  bio: optionalText(1000, "自己紹介"),
  canOffer: optionalText(500, "紹介できること"),
  lookingFor: optionalText(500, "探していること"),
  twitterUrl: optionalUrl,
  facebookUrl: optionalUrl,
  linkedinUrl: optionalUrl,
});

export type UpdateProfileFormState =
  | {
      status: "error";
      errors?: Partial<
        Record<keyof z.infer<typeof UpdateProfileSchema>, string[]>
      >;
      message?: string;
    }
  | { status: "success"; message: string }
  | undefined;
