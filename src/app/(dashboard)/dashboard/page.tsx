import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import { getMyProfile } from "@/features/profile/repository";
import { listMyCompanies } from "@/features/companies/repository";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardHomePage() {
  return (
    <div className="flex flex-1 flex-col gap-10 px-6 py-8 sm:px-10 sm:py-10">
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

  // ログイン経路以外(既存セッションでの直接アクセス等)でも、プロフィール
  // 未設定のまま来た場合は必ず設定画面に誘導する。
  if (!profile.onboarded) {
    redirect("/profile");
  }

  return (
    <>
      <div className="app-hero flex flex-col gap-2 rounded-2xl border border-border px-8 py-10 sm:px-10">
        <span className="h-1 w-8 rounded-full bg-primary" />
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          ようこそ、{profile.displayName} さん
        </h1>
        <p className="text-sm text-muted-foreground">
          {profile.title ?? "プロフィールに肩書きを設定できます。"}
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">所属企業</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/companies">すべての企業を見る</Link>
          </Button>
        </div>

        {myCompanies.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            まだどの企業にも所属していません。
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myCompanies.map((company) => (
              <Link key={company.id} href={`/companies/${company.id}`}>
                <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Building2 className="size-4" />
                      </span>
                      <CardTitle>{company.name}</CardTitle>
                    </div>
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
