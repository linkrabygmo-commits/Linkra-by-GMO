import { Suspense } from "react";
import type { Metadata } from "next";
import { listAllMembers } from "@/features/admin/repository";
import { updateMemberStatusAction, deleteMemberAction } from "@/features/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "会員管理",
};

const STATUS_LABELS = {
  registered: "登録済み",
  approved: "承認済み",
  admin: "管理者",
} as const;

const STATUS_BADGE_VARIANTS = {
  registered: "secondary",
  approved: "default",
  admin: "outline",
} as const;

export default function AdminMembersPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">会員管理</h1>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <MembersList />
      </Suspense>
    </div>
  );
}

async function MembersList() {
  const members = await listAllMembers();

  if (members.length === 0) {
    return <p className="text-muted-foreground">会員がいません。</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {members.map((member) => (
        <li
          key={member.id}
          className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{member.displayName}</p>
              <Badge variant={STATUS_BADGE_VARIANTS[member.memberStatus]}>
                {STATUS_LABELS[member.memberStatus]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {member.companyName ?? "会社名未設定"}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {(Object.keys(STATUS_LABELS) as (keyof typeof STATUS_LABELS)[])
              .filter((status) => status !== member.memberStatus)
              .map((status) => (
                <form
                  key={status}
                  action={updateMemberStatusAction.bind(null, member.id, status)}
                >
                  <Button type="submit" variant="outline" size="sm">
                    {STATUS_LABELS[status]}にする
                  </Button>
                </form>
              ))}
            <form action={deleteMemberAction.bind(null, member.id)}>
              <Button type="submit" variant="outline" size="sm">
                削除
              </Button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
