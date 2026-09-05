import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Building2 } from "lucide-react";
import { listCompanies } from "@/features/companies/repository";
import { Badge } from "@/components/ui/badge";
import { SearchForm } from "@/components/ui/search-form";

export const metadata: Metadata = {
  title: "企業ディレクトリ",
};

interface CompaniesPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default function CompaniesPage({ searchParams }: CompaniesPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <h1 className="text-2xl font-semibold text-foreground">企業ディレクトリ</h1>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <CompanyListContent searchParamsPromise={searchParams} />
      </Suspense>
    </div>
  );
}

async function CompanyListContent({
  searchParamsPromise,
}: {
  searchParamsPromise: CompaniesPageProps["searchParams"];
}) {
  const { q } = await searchParamsPromise;
  const companies = await listCompanies(q);

  return (
    <div className="flex flex-col gap-4">
      <SearchForm action="/companies" defaultValue={q} placeholder="企業名・概要で検索" />

      {companies.length === 0 ? (
        <p className="text-muted-foreground">
          {q ? "該当する企業が見つかりません。" : "まだ会社が登録されていません。"}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {companies.map((company) => (
            <li key={company.id}>
              <Link
                href={`/companies/${company.id}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {company.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={company.logoUrl}
                    alt=""
                    className="size-12 shrink-0 rounded-full border border-border object-cover"
                  />
                ) : (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Building2 className="size-5" />
                  </span>
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{company.name}</p>
                    <Badge variant="secondary">{company.memberCount}人</Badge>
                  </div>
                  {company.description && (
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {company.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
