import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventById } from "@/features/events/repository";
import { EventForm } from "@/features/events/components/event-form";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "イベントを編集",
};

interface EditEventPageProps {
  params: Promise<{ eventId: string }>;
}

export default function EditEventPage({ params }: EditEventPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <Suspense fallback={null}>
        <EditEventForm paramsPromise={params} />
      </Suspense>
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
    <>
      <Breadcrumb
        items={[
          { label: "管理画面", href: "/admin" },
          { label: "イベント管理", href: "/admin/events" },
          { label: event.title, href: `/admin/events/${event.id}` },
          { label: "編集" },
        ]}
      />
      <h1 className="text-2xl font-semibold text-foreground">イベントを編集</h1>
      <div className="max-w-md">
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
      </div>
    </>
  );
}
