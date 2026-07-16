"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as repository from "@/features/companies/repository";
import { CreateCompanySchema, type CreateCompanyFormState } from "@/features/companies/schema";

export async function createCompanyAction(
  _prevState: CreateCompanyFormState,
  formData: FormData,
): Promise<CreateCompanyFormState> {
  const validatedFields = CreateCompanySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
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

export async function leaveCompanyAction(companyId: string) {
  await repository.leaveCompany(companyId);
  revalidatePath(`/companies/${companyId}`);
  redirect("/companies");
}
