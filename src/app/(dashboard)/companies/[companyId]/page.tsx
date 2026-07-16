import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCompanyById, listMembers } from "@/features/companies/repository";
import { leaveCompanyAction } from "@/features/companies/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-10">
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <CompanyDetailContent paramsPromise={params} />
      </Suspense>
    </div>
  );
}

async function CompanyDetailContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ companyId: string }>;
}) {
  const { companyId } = await paramsPromise;
  const company = await getCompanyById(companyId);

  if (!company) {
    notFound();
  }

  const members = await listMembers(companyId);

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {company.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logoUrl}
              alt=""
              className="size-14 rounded-lg border border-border object-cover"
            />
          )}
          <h1 className="text-2xl font-semibold text-foreground">
            {company.name}
          </h1>
        </div>
        {company.currentUserRole && (
          <form action={leaveCompanyAction.bind(null, companyId)}>
            <Button type="submit" variant="outline" size="sm">
              退会する
            </Button>
          </form>
        )}
      </div>

      {company.description && (
        <p className="max-w-2xl text-sm text-muted-foreground">
          {company.description}
        </p>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium text-foreground">
          メンバー({members.length}人)
        </h2>
        <ul className="flex flex-col gap-2">
          {members.map((member) => (
            <li
              key={member.userId}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-2"
            >
              <span className="text-sm text-foreground">
                {member.displayName}
              </span>
              <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                {member.role === "owner"
                  ? "オーナー"
                  : member.role === "admin"
                    ? "管理者"
                    : "メンバー"}
              </Badge>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
