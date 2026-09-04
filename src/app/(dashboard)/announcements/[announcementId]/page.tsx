import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPublishedAnnouncementById } from "@/features/announcements/repository";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { AnnouncementDetailSkeleton } from "@/components/layout/detail-skeletons";
import { formatJstDate } from "@/lib/datetime";

interface AnnouncementDetailPageProps {
  params: Promise<{ announcementId: string }>;
}

export default function AnnouncementDetailPage({ params }: AnnouncementDetailPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-12">
      <Suspense fallback={<AnnouncementDetailSkeleton />}>
        <AnnouncementDetail paramsPromise={params} />
      </Suspense>
    </div>
  );
}

async function AnnouncementDetail({
  paramsPromise,
}: {
  paramsPromise: AnnouncementDetailPageProps["params"];
}) {
  const { announcementId } = await paramsPromise;
  const announcement = await getPublishedAnnouncementById(announcementId);

  if (!announcement) {
    notFound();
  }

  return (
    <>
      <Breadcrumb
        items={[{ label: "お知らせ", href: "/announcements" }, { label: announcement.title }]}
      />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">{announcement.title}</h1>
        {announcement.publishedAt && (
          <p className="text-sm text-muted-foreground">
            {formatJstDate(announcement.publishedAt, { dateStyle: "medium" })}
          </p>
        )}
      </div>
      {announcement.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={announcement.coverImageUrl}
          alt=""
          className="w-full rounded-lg border border-border object-cover"
        />
      )}
      <p className="whitespace-pre-line text-sm text-foreground">{announcement.body}</p>
    </>
  );
}
