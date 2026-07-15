import { Suspense } from "react";
import type { Metadata } from "next";
import { listMembers } from "@/features/members/repository";
import { MemberCard } from "@/features/members/components/member-card";

export const metadata: Metadata = {
  title: "会員ディレクトリ",
  description: "Linkra by GMOに参加する会員の一覧です。",
};

export default function MembersPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">会員ディレクトリ</h1>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <MembersList />
      </Suspense>
    </div>
  );
}

async function MembersList() {
  const members = await listMembers();

  if (members.length === 0) {
    return <p className="text-muted-foreground">まだ会員がいません。</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}
