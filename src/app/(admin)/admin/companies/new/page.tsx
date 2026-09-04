import { Suspense } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { CreateCompanyForm } from "@/features/companies/components/create-company-form";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "企業を作成",
};

export default function NewCompanyPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <Breadcrumb
        items={[
          { label: "管理画面", href: "/admin" },
          { label: "企業管理", href: "/admin/companies" },
          { label: "新規作成" },
        ]}
      />
      <h1 className="text-2xl font-semibold text-foreground">企業を作成</h1>
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
  return <CreateCompanyForm />;
}
