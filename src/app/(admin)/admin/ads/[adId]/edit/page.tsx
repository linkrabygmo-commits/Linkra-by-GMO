import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdByIdForAdmin } from "@/features/ads/repository";
import { AdForm } from "@/features/ads/components/ad-form";

export const metadata: Metadata = {
  title: "広告を編集",
};

interface EditAdPageProps {
  params: Promise<{ adId: string }>;
}

export default function EditAdPage({ params }: EditAdPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <h1 className="text-2xl font-semibold text-foreground">広告を編集</h1>
      <div className="max-w-md">
        <Suspense fallback={null}>
          <EditAdForm paramsPromise={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function EditAdForm({ paramsPromise }: { paramsPromise: EditAdPageProps["params"] }) {
  const { adId } = await paramsPromise;
  const ad = await getAdByIdForAdmin(adId);

  if (!ad) {
    notFound();
  }

  return (
    <AdForm
      adId={ad.id}
      defaultValues={{
        linkUrl: ad.linkUrl,
        imageUrl: ad.imageUrl,
        startsAt: ad.startsAt,
        endsAt: ad.endsAt,
      }}
    />
  );
}
