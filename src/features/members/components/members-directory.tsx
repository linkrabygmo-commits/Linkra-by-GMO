"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import type { MemberSummaryDto } from "@/features/members/repository";
import { MemberCard } from "@/features/members/components/member-card";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";

// 検索ボタン/Enter不要のリアルタイム絞り込み。会員数が今のところ少なく、
// 全件を一度に取得してもコストが低いため、サーバーへの再問い合わせなしに
// クライアント側でその場でフィルタする。
export function MembersDirectory({ members }: { members: MemberSummaryDto[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return members;
    return members.filter(
      (member) =>
        member.displayName.toLowerCase().includes(trimmed) ||
        (member.companyName?.toLowerCase().includes(trimmed) ?? false),
    );
  }, [members, query]);

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="氏名・会社名で検索"
        className="w-full max-w-sm"
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={
            query ? "該当する会員が見つかりません。" : "まだ会員がいません。"
          }
          description={
            query ? "別のキーワードで検索してみてください。" : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
