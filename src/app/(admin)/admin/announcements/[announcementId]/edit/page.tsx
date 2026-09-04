import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAnnouncementByIdForAdmin } from "@/features/announcements/repository";
import { AnnouncementForm } from "@/features/announcements/components/announcement-form";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "お知らせを編集",
};

interface EditAnnouncementPageProps {
  params: Promise<{ announcementId: string }>;
}

export default function EditAnnouncementPage({ params }: EditAnnouncementPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <Suspense fallback={null}>
        <EditAnnouncementForm paramsPromise={params} />
      </Suspense>
    </div>
  );
}

async function EditAnnouncementForm({
  paramsPromise,
}: {
  paramsPromise: EditAnnouncementPageProps["params"];
}) {
  const { announcementId } = await paramsPromise;
  const announcement = await getAnnouncementByIdForAdmin(announcementId);

  if (!announcement) {
    notFound();
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "管理画面", href: "/admin" },
          { label: "お知らせ管理", href: "/admin/announcements" },
          { label: announcement.title },
          { label: "編集" },
        ]}
      />
      <h1 className="text-2xl font-semibold text-foreground">お知らせを編集</h1>
      <div className="max-w-md">
        <AnnouncementForm
          announcementId={announcement.id}
          defaultValues={{
            title: announcement.title,
            body: announcement.body,
            coverImageUrl: announcement.coverImageUrl,
            status: announcement.status,
          }}
        />
      </div>
    </>
  );
}
