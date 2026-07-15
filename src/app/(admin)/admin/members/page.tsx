import { Suspense } from "react";
import type { Metadata } from "next";
import { listPendingMembers } from "@/features/admin/repository";
import { approveMemberAction } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "会員承認",
};

export default function AdminMembersPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">会員承認</h1>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <PendingMembersList />
      </Suspense>
    </div>
  );
}

async function PendingMembersList() {
  const pendingMembers = await listPendingMembers();

  if (pendingMembers.length === 0) {
    return <p className="text-muted-foreground">承認待ちの会員はいません。</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {pendingMembers.map((member) => (
        <li
          key={member.id}
          className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
        >
          <div>
            <p className="text-sm font-medium text-foreground">
              {member.displayName}
            </p>
            <p className="text-xs text-muted-foreground">
              {member.companyName ?? "会社名未設定"}
              {member.industry ? ` / ${member.industry}` : ""}
            </p>
          </div>
          <form action={approveMemberAction.bind(null, member.id)}>
            <Button type="submit" size="sm">
              承認する
            </Button>
          </form>
        </li>
      ))}
    </ul>
  );
}
