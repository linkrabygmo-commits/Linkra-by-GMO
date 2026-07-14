import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { listCompanies } from "@/features/companies/repository";
import { COMPANY_TYPE_LABELS } from "@/features/companies/components/create-company-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "企業一覧",
};

export default function CompaniesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">企業一覧</h1>
        <Button asChild>
          <Link href="/companies/new">会社を作成</Link>
        </Button>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <CompanyListContent />
      </Suspense>
    </div>
  );
}

async function CompanyListContent() {
  const companies = await listCompanies();

  if (companies.length === 0) {
    return (
      <p className="text-muted-foreground">
        まだ会社が登録されていません。最初の会社を作成しましょう。
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <Link key={company.id} href={`/companies/${company.id}`}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>{company.name}</CardTitle>
              <CardDescription>
                {COMPANY_TYPE_LABELS[company.type]}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {company.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {company.description}
                </p>
              )}
              <Badge variant="secondary" className="w-fit">
                {company.memberCount}人
              </Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
