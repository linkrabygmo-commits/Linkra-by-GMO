import * as z from "zod";

export const CreateCompanySchema = z.object({
  name: z
    .string()
    .min(1, { error: "会社名を入力してください。" })
    .max(100, { error: "会社名は100文字以内で入力してください。" })
    .trim(),
  description: z
    .string()
    .max(500, { error: "説明は500文字以内で入力してください。" })
    .trim()
    .optional(),
  logoUrl: z
    .union([z.url({ error: "有効なURLを入力してください。" }), z.literal("")])
    .optional(),
});

export type CreateCompanyFormState =
  | {
      status: "error";
      errors?: {
        name?: string[];
        description?: string[];
        logoUrl?: string[];
      };
      message?: string;
    }
  | undefined;
