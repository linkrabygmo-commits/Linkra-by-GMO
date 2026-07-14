import * as z from "zod";

export const CompanyTypeValues = ["client", "partner", "group"] as const;
export const CompanyRoleValues = ["owner", "admin", "member"] as const;

export const CreateCompanySchema = z.object({
  name: z
    .string()
    .min(1, { error: "会社名を入力してください。" })
    .max(100, { error: "会社名は100文字以内で入力してください。" })
    .trim(),
  type: z.enum(CompanyTypeValues, {
    error: "種別を選択してください。",
  }),
  description: z
    .string()
    .max(500, { error: "説明は500文字以内で入力してください。" })
    .trim()
    .optional(),
});

export type CreateCompanyFormState =
  | {
      status: "error";
      errors?: {
        name?: string[];
        type?: string[];
        description?: string[];
      };
      message?: string;
    }
  | undefined;

export const InviteMemberSchema = z.object({
  email: z.email({ error: "有効なメールアドレスを入力してください。" }).trim(),
  role: z.enum(["admin", "member"], {
    error: "権限を選択してください。",
  }),
});

export type InviteMemberFormState =
  | {
      status: "idle" | "error";
      errors?: {
        email?: string[];
        role?: string[];
      };
      message?: string;
    }
  | { status: "success"; message: string }
  | undefined;
