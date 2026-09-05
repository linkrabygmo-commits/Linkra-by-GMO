import { Suspense } from "react";
import type { Metadata } from "next";
import { Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { listAllMembers } from "@/features/admin/repository";
import { deleteMemberAction } from "@/features/admin/actions";
import { listPendingPasswordResetRequests } from "@/features/password-reset/repository";
import { approvePasswordResetRequestAction } from "@/features/password-reset/actions";
import { MemberStatusSelect } from "@/components/admin/member-status-select";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatJstDateTime } from "@/lib/datetime";

export const metadata: Metadata = {
  title: "会員管理",
};

export default function AdminMembersPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <Breadcrumb
        items={[{ label: "管理画面", href: "/admin" }, { label: "会員管理" }]}
      />
      <PageHeader
        title="会員管理"
        description="登録されている会員の承認・削除ができます。"
        action={<CopyLinkButton path="/signup" label="招待リンクをコピー" />}
      />
      <Suspense
        fallback={<p className="text-muted-foreground">読み込み中...</p>}
      >
        <PasswordResetRequests />
      </Suspense>
      <Suspense
        fallback={<p className="text-muted-foreground">読み込み中...</p>}
      >
        <MembersList />
      </Suspense>
    </div>
  );
}

async function PasswordResetRequests() {
  const requests = await listPendingPasswordResetRequests();

  if (requests.length === 0) return null;

  return (
    <Card className="gap-3 px-5 py-5">
      <h2 className="text-sm font-medium text-foreground">
        パスワードリセット申請({requests.length}件)
      </h2>
      <ul className="flex flex-col gap-2">
        {requests.map((request) => (
          <li
            key={request.id}
            className="flex flex-col gap-2 rounded-lg border border-border px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">
                {request.displayName}
              </p>
              <p className="text-xs text-muted-foreground">
                申請日時: {formatJstDateTime(request.requestedAt)}
              </p>
            </div>
            <form
              action={approvePasswordResetRequestAction.bind(null, request.id)}
            >
              <Button type="submit" size="sm">
                承認する
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </Card>
  );
}

async function MembersList() {
  const [currentAdmin, members] = await Promise.all([
    requireAdmin(),
    listAllMembers(),
  ]);

  if (members.length === 0) {
    return <EmptyState icon={Users} title="会員がいません。" />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {members.map((member) => {
        const isSelf = member.id === currentAdmin.id;

        return (
          <li key={member.id}>
            <Card className="flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {member.displayName}
                  </p>
                  {member.memberStatus === "admin" && (
                    <Badge variant="info">管理者</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {member.companyName ?? "会社名未設定"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                <MemberStatusSelect
                  memberId={member.id}
                  currentStatus={member.memberStatus}
                  disabled={isSelf}
                />
                <ConfirmSubmitButton
                  variant="destructive"
                  size="sm"
                  disabled={isSelf}
                  action={deleteMemberAction.bind(null, member.id)}
                  confirmMessage={`${member.displayName} を削除します。この操作は取り消せません。よろしいですか？`}
                >
                  削除
                </ConfirmSubmitButton>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
