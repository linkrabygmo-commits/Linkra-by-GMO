import { Suspense } from "react";
import type { Metadata } from "next";
import { listCompanies } from "@/features/companies/repository";
import { CompaniesDirectory } from "@/features/companies/components/companies-directory";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "企業ディレクトリ",
};

export default function CompaniesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <PageHeader
        title="企業ディレクトリ"
        description="登録されている企業を検索・確認できます。"
      />
      <Suspense
        fallback={<p className="text-muted-foreground">読み込み中...</p>}
      >
        <CompanyListContent />
      </Suspense>
    </div>
  );
}

async function CompanyListContent() {
  const companies = await listCompanies();
  return <CompaniesDirectory companies={companies} />;
}
