import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { listCompanies } from "@/features/companies/repository";
import { deleteCompanyAction } from "@/features/companies/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";

export const metadata: Metadata = {
  title: "企業管理",
};

export default function AdminCompaniesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">企業管理</h1>
        <Button asChild size="sm" className="w-fit">
          <Link href="/admin/companies/new">新しく作成</Link>
        </Button>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <CompanyList />
      </Suspense>
    </div>
  );
}

async function CompanyList() {
  await requireAdmin();
  const companies = await listCompanies();

  if (companies.length === 0) {
    return <p className="text-muted-foreground">まだ会社が登録されていません。</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {companies.map((company) => (
        <li
          key={company.id}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 ring-1 ring-foreground/10 sm:flex-row sm:items-center"
        >
          <div className="flex min-w-0 flex-1 items-center gap-4">
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logoUrl}
                alt=""
                className="size-10 shrink-0 rounded-full border border-border object-cover"
              />
            ) : (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Building2 className="size-4" />
              </span>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{company.name}</p>
                <Badge variant="secondary">{company.memberCount}人</Badge>
              </div>
              {company.description && (
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  {company.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <Button asChild variant="outline" size="sm">
              <Link href={`/companies/${company.id}`}>詳細</Link>
            </Button>
            <form action={deleteCompanyAction.bind(null, company.id)}>
              <ConfirmSubmitButton
                variant="outline"
                size="sm"
                confirmMessage={`「${company.name}」を削除します。所属する全メンバーの紐付けも失われます。本当に削除しますか？`}
              >
                削除
              </ConfirmSubmitButton>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
