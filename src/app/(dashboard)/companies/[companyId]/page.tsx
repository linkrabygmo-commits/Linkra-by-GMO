import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getCompanyById,
  listMembers,
  listInvitations,
} from "@/features/companies/repository";
import { InviteMemberForm } from "@/features/companies/components/invite-member-form";
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

  const [members, invitations] = await Promise.all([
    listMembers(companyId),
    company.currentUserRole === "owner" || company.currentUserRole === "admin"
      ? listInvitations(companyId)
      : Promise.resolve([]),
  ]);

  const isAdmin =
    company.currentUserRole === "owner" || company.currentUserRole === "admin";

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
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

      {isAdmin && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-medium text-foreground">メンバーを招待</h2>
          <div className="max-w-sm">
            <InviteMemberForm companyId={companyId} />
          </div>

          {invitations.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                招待中
              </h3>
              <ul className="flex flex-col gap-2">
                {invitations.map((invitation) => (
                  <li
                    key={invitation.id}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
                  >
                    <span className="text-foreground">{invitation.email}</span>
                    <Badge variant="outline">
                      {invitation.role === "admin" ? "管理者" : "メンバー"}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </>
  );
}
