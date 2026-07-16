"use server";

import { revalidatePath } from "next/cache";
import * as repository from "@/features/announcements/repository";
import { AnnouncementSchema, type AnnouncementFormState } from "@/features/announcements/schema";

function readAnnouncementFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    body: formData.get("body"),
    coverImageUrl: formData.get("coverImageUrl") || undefined,
    status: formData.get("status"),
  };
}

export async function createAnnouncementAction(
  _prevState: AnnouncementFormState,
  formData: FormData,
): Promise<AnnouncementFormState> {
  const validatedFields = AnnouncementSchema.safeParse(readAnnouncementFormData(formData));

  if (!validatedFields.success) {
    return { status: "error", errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await repository.createAnnouncement(validatedFields.data);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "お知らせの作成に失敗しました。",
    };
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath("/");

  return { status: "success", message: "お知らせを保存しました。" };
}

export async function updateAnnouncementAction(
  announcementId: string,
  _prevState: AnnouncementFormState,
  formData: FormData,
): Promise<AnnouncementFormState> {
  const validatedFields = AnnouncementSchema.safeParse(readAnnouncementFormData(formData));

  if (!validatedFields.success) {
    return { status: "error", errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await repository.updateAnnouncement(announcementId, validatedFields.data);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "お知らせの更新に失敗しました。",
    };
  }

  revalidatePath("/admin/announcements");
  revalidatePath(`/announcements/${announcementId}`);
  revalidatePath("/announcements");
  revalidatePath("/");

  return { status: "success", message: "お知らせを更新しました。" };
}

export async function deleteAnnouncementAction(announcementId: string) {
  await repository.deleteAnnouncement(announcementId);
  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath("/");
}
