import { Suspense } from "react";
import type { Metadata } from "next";
import { listMembers } from "@/features/members/repository";
import { MembersDirectory } from "@/features/members/components/members-directory";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "会員ディレクトリ",
  description: "Linkra by GMOに参加する会員の一覧です。",
};

export default function MembersPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10">
      <PageHeader
        title="会員ディレクトリ"
        description="登録されている会員を検索・確認できます。"
      />
      <Suspense
        fallback={<p className="text-muted-foreground">読み込み中...</p>}
      >
        <MembersList />
      </Suspense>
    </div>
  );
}

async function MembersList() {
  const members = await listMembers();
  return <MembersDirectory members={members} />;
}
