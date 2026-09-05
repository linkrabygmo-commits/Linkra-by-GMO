import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { listCompanies } from "@/features/companies/repository";
import { deleteCompanyAction } from "@/features/companies/actions";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { EmptyState } from "@/components/ui/empty-state";
import { STAT_TONE_CLASSES } from "@/components/ui/stat-card";

export const metadata: Metadata = {
  title: "企業管理",
};

export default function AdminCompaniesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <Breadcrumb
        items={[{ label: "管理画面", href: "/admin" }, { label: "企業管理" }]}
      />
      <PageHeader
        title="企業管理"
        description="登録されている企業の確認・削除ができます。"
        action={
          <Button asChild size="sm" className="w-fit">
            <Link href="/admin/companies/new">新しく作成</Link>
          </Button>
        }
      />
      <Suspense
        fallback={<p className="text-muted-foreground">読み込み中...</p>}
      >
        <CompanyList />
      </Suspense>
    </div>
  );
}

async function CompanyList() {
  await requireAdmin();
  const companies = await listCompanies();

  if (companies.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="まだ会社が登録されていません。"
        description="新しく作成すると、ここに一覧表示されます。"
        action={
          <Button asChild size="sm">
            <Link href="/admin/companies/new">新しく作成</Link>
          </Button>
        }
      />
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {companies.map((company) => (
        <li key={company.id}>
          <Card className="flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              {company.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={company.logoUrl}
                  alt=""
                  className="size-10 shrink-0 rounded-full border border-border object-cover"
                />
              ) : (
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${STAT_TONE_CLASSES.purple}`}
                >
                  <Building2 className="size-4" />
                </span>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {company.name}
                  </p>
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
              <ConfirmSubmitButton
                variant="destructive"
                size="sm"
                action={deleteCompanyAction.bind(null, company.id)}
                confirmMessage={`「${company.name}」を削除します。所属する全メンバーの紐付けも失われます。本当に削除しますか？`}
              >
                削除
              </ConfirmSubmitButton>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
