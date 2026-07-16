import { Suspense } from "react";
import type { Metadata } from "next";
import { CreateCompanyForm } from "@/features/companies/components/create-company-form";

export const metadata: Metadata = {
  title: "会社情報を設定",
};

export default function NewCompanyPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">会社情報を設定</h1>
      <div className="max-w-md">
        <Suspense fallback={null}>
          <CreateCompanyForm />
        </Suspense>
      </div>
    </div>
  );
}
