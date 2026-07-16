"use server";

import { revalidatePath } from "next/cache";
import * as repository from "@/features/events/repository";
import {
  EventSchema,
  GuestEventApplicationSchema,
  type EventFormState,
  type GuestEventApplicationFormState,
} from "@/features/events/schema";
import type { EventApplicationStatus } from "@/types/database";

function readEventFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    coverImageUrl: formData.get("coverImageUrl") || undefined,
    audience: formData.get("audience"),
    location: formData.get("location") || undefined,
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || undefined,
    capacity: formData.get("capacity") || undefined,
  };
}

export async function createEventAction(
  _prevState: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const validatedFields = EventSchema.safeParse(readEventFormData(formData));

  if (!validatedFields.success) {
    return { status: "error", errors: validatedFields.error.flatten().fieldErrors };
  }

  const { startsAt, endsAt, ...rest } = validatedFields.data;

  try {
    await repository.createEvent({
      ...rest,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
    });
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "イベントの作成に失敗しました。",
    };
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");

  return { status: "success", message: "イベントを作成しました。" };
}

export async function updateEventAction(
  eventId: string,
  _prevState: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const validatedFields = EventSchema.safeParse(readEventFormData(formData));

  if (!validatedFields.success) {
    return { status: "error", errors: validatedFields.error.flatten().fieldErrors };
  }

  const { startsAt, endsAt, ...rest } = validatedFields.data;

  try {
    await repository.updateEvent(eventId, {
      ...rest,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
    });
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "イベントの更新に失敗しました。",
    };
  }

  revalidatePath("/admin/events");
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");

  return { status: "success", message: "イベントを更新しました。" };
}

export async function deleteEventAction(eventId: string) {
  await repository.deleteEvent(eventId);
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
}

export async function applyAsMemberAction(eventId: string) {
  await repository.applyAsMember(eventId);
  revalidatePath(`/events/${eventId}`);
}

export async function cancelMyApplicationAction(eventId: string) {
  await repository.cancelMyApplication(eventId);
  revalidatePath(`/events/${eventId}`);
}

export async function applyAsGuestAction(
  eventId: string,
  _prevState: GuestEventApplicationFormState,
  formData: FormData,
): Promise<GuestEventApplicationFormState> {
  const validatedFields = GuestEventApplicationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
  });

  if (!validatedFields.success) {
    return { status: "error", errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await repository.applyAsGuest({ eventId, ...validatedFields.data });
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "申込に失敗しました。",
    };
  }

  revalidatePath(`/events/${eventId}`);

  return { status: "success", message: "お申し込みを受け付けました。" };
}

export async function updateApplicationStatusAction(
  eventId: string,
  applicationType: "member" | "guest",
  applicationId: string,
  status: EventApplicationStatus,
) {
  await repository.updateApplicationStatus(applicationType, applicationId, status);
  revalidatePath(`/admin/events/${eventId}`);
}
