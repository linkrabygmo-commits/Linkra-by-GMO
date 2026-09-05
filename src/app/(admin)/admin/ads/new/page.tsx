import { Suspense } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { AdForm } from "@/features/ads/components/ad-form";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "広告を作成",
};

export default function NewAdPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <Breadcrumb
        items={[
          { label: "管理画面", href: "/admin" },
          { label: "広告設定", href: "/admin/ads" },
          { label: "新規作成" },
        ]}
      />
      <PageHeader title="広告を作成" />
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
