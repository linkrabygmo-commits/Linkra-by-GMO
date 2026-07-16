import { Suspense } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { AdForm } from "@/features/ads/components/ad-form";

export const metadata: Metadata = {
  title: "広告を作成",
};

export default function NewAdPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <h1 className="text-2xl font-semibold text-foreground">広告を作成</h1>
      <div className="max-w-md">
        <Suspense fallback={null}>
          <Gate />
        </Suspense>
      </div>
    </div>
  );
}

async function Gate() {
  await requireAdmin();
  return <AdForm />;
}
