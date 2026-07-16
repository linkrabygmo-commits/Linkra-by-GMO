import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventById } from "@/features/events/repository";
import { EventForm } from "@/features/events/components/event-form";

export const metadata: Metadata = {
  title: "イベントを編集",
};

interface EditEventPageProps {
  params: Promise<{ eventId: string }>;
}

export default function EditEventPage({ params }: EditEventPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <h1 className="text-2xl font-semibold text-foreground">イベントを編集</h1>
      <div className="max-w-md">
        <Suspense fallback={null}>
          <EditEventForm paramsPromise={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function EditEventForm({ paramsPromise }: { paramsPromise: EditEventPageProps["params"] }) {
  const { eventId } = await paramsPromise;
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  return (
    <EventForm
      eventId={event.id}
      defaultValues={{
        title: event.title,
        description: event.description,
        coverImageUrl: event.coverImageUrl,
        audience: event.audience,
        location: event.location,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        capacity: event.capacity,
      }}
    />
  );
}
