"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as repository from "@/features/companies/repository";
import {
  CreateCompanySchema,
  InviteMemberSchema,
  type CreateCompanyFormState,
  type InviteMemberFormState,
} from "@/features/companies/schema";

export async function createCompanyAction(
  _prevState: CreateCompanyFormState,
  formData: FormData,
): Promise<CreateCompanyFormState> {
  const validatedFields = CreateCompanySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  let company;
  try {
    company = await repository.createCompany(validatedFields.data);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "作成に失敗しました。",
    };
  }

  revalidatePath("/companies");
  redirect(`/companies/${company.id}`);
}

export async function inviteMemberAction(
  companyId: string,
  _prevState: InviteMemberFormState,
  formData: FormData,
): Promise<InviteMemberFormState> {
  const validatedFields = InviteMemberSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await repository.inviteMember({ companyId, ...validatedFields.data });
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "招待に失敗しました。",
    };
  }

  revalidatePath(`/companies/${companyId}`);
  return { status: "success", message: "招待を送信しました。" };
}

export async function acceptInvitationAction(token: string) {
  const companyId = await repository.acceptInvitation(token);
  redirect(`/companies/${companyId}`);
}

export async function leaveCompanyAction(companyId: string) {
  await repository.leaveCompany(companyId);
  revalidatePath(`/companies/${companyId}`);
  redirect("/companies");
}
