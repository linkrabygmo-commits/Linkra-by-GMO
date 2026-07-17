import { Suspense } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { listAllMembers } from "@/features/admin/repository";
import { deleteMemberAction } from "@/features/admin/actions";
import { MemberStatusSelect } from "@/components/admin/member-status-select";
import { Badge } from "@/components/ui/badge";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";

export const metadata: Metadata = {
  title: "会員管理",
};

export default function AdminMembersPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <h1 className="text-2xl font-semibold text-foreground">会員管理</h1>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <MembersList />
      </Suspense>
    </div>
  );
}

async function MembersList() {
  const [currentAdmin, members] = await Promise.all([requireAdmin(), listAllMembers()]);

  if (members.length === 0) {
    return <p className="text-muted-foreground">会員がいません。</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {members.map((member) => {
        const isSelf = member.id === currentAdmin.id;

        return (
          <li
            key={member.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{member.displayName}</p>
                {member.memberStatus === "admin" && <Badge variant="outline">管理者</Badge>}
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
              <form action={deleteMemberAction.bind(null, member.id)}>
                <ConfirmSubmitButton
                  variant="destructive"
                  size="sm"
                  disabled={isSelf}
                  confirmMessage={`${member.displayName} を削除します。この操作は取り消せません。よろしいですか？`}
                >
                  削除
                </ConfirmSubmitButton>
              </form>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
