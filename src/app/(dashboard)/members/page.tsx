import { Suspense } from "react";
import type { Metadata } from "next";
import { listMembers } from "@/features/members/repository";
import { MemberCard } from "@/features/members/components/member-card";
import { SearchForm } from "@/components/ui/search-form";

export const metadata: Metadata = {
  title: "会員ディレクトリ",
  description: "Linkra by GMOに参加する会員の一覧です。",
};

interface MembersPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default function MembersPage({ searchParams }: MembersPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">会員ディレクトリ</h1>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <MembersList searchParamsPromise={searchParams} />
      </Suspense>
    </div>
  );
}

async function MembersList({
  searchParamsPromise,
}: {
  searchParamsPromise: MembersPageProps["searchParams"];
}) {
  const { q } = await searchParamsPromise;
  const members = await listMembers(q);

  return (
    <div className="flex flex-col gap-4">
      <SearchForm action="/members" defaultValue={q} placeholder="氏名・会社名で検索" />

      {members.length === 0 ? (
        <p className="text-muted-foreground">
          {q ? "該当する会員が見つかりません。" : "まだ会員がいません。"}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
