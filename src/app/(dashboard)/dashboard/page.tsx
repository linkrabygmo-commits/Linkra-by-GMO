import { Suspense } from "react";
import Link from "next/link";
import { getMyProfile } from "@/features/profile/repository";
import { listMyCompanies } from "@/features/companies/repository";
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

export default function DashboardHomePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10">
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <DashboardHomeContent />
      </Suspense>
    </div>
  );
}

async function DashboardHomeContent() {
  const [profile, myCompanies] = await Promise.all([
    getMyProfile(),
    listMyCompanies(),
  ]);

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          ようこそ、{profile.displayName} さん
        </h1>
        <p className="text-muted-foreground">
          {profile.title ?? "プロフィールに肩書きを設定できます。"}
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">所属企業</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/companies">すべての企業を見る</Link>
          </Button>
        </div>

        {myCompanies.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            まだどの企業にも所属していません。
            <Link href="/companies/new" className="ml-1 text-primary hover:underline">
              会社を作成
            </Link>
            するか、招待をお待ちください。
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myCompanies.map((company) => (
              <Link key={company.id} href={`/companies/${company.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{company.name}</CardTitle>
                    <CardDescription>
                      {COMPANY_TYPE_LABELS[company.type]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      variant={company.role === "owner" ? "default" : "secondary"}
                    >
                      {company.role === "owner"
                        ? "オーナー"
                        : company.role === "admin"
                          ? "管理者"
                          : "メンバー"}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
