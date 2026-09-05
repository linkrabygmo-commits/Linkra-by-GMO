import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventById } from "@/features/events/repository";
import { EventForm } from "@/features/events/components/event-form";
import { requireAdmin } from "@/lib/auth/session";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHeader } from "@/components/layout/page-header";
import { FormSkeleton } from "@/components/layout/detail-skeletons";

export const metadata: Metadata = {
  title: "イベントを編集",
};

interface EditEventPageProps {
  params: Promise<{ eventId: string }>;
}

export default function EditEventPage({ params }: EditEventPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <Suspense fallback={<FormSkeleton breadcrumbSegments={4} fields={5} />}>
        <EditEventForm paramsPromise={params} />
      </Suspense>
    </div>
  );
}

async function EditEventForm({
  paramsPromise,
}: {
  paramsPromise: EditEventPageProps["params"];
}) {
  // getEventById()は/events/[eventId](ダッシュボード側の公開詳細ページ)とも共有しているため
  // 管理者チェックを内包しない。この編集ページ自体は管理者専用なので、ここで明示的に確認する。
  await requireAdmin();

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
      <PageHeader title="イベントを編集" />
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
            applicationDeadline: event.applicationDeadline,
          }}
        />
      </div>
    </>
  );
}
