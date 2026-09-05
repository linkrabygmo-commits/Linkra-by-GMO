"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Building2 } from "lucide-react";
import type { CompanyDto } from "@/features/companies/repository";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";
import { STAT_TONE_CLASSES } from "@/components/ui/stat-card";

// 検索ボタン/Enter不要のリアルタイム絞り込み。企業数が今のところ少なく、
// 全件を一度に取得してもコストが低いため、サーバーへの再問い合わせなしに
// クライアント側でその場でフィルタする。
export function CompaniesDirectory({ companies }: { companies: CompanyDto[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return companies;
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(trimmed) ||
        (company.description?.toLowerCase().includes(trimmed) ?? false),
    );
  }, [companies, query]);

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="企業名・概要で検索"
        className="w-full max-w-sm"
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={
            query
              ? "該当する企業が見つかりません。"
              : "まだ会社が登録されていません。"
          }
          description={
            query ? "別のキーワードで検索してみてください。" : undefined
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((company) => (
            <li key={company.id}>
              <Link href={`/companies/${company.id}`}>
                <Card className="flex-row items-center gap-4 px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
                  {company.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={company.logoUrl}
                      alt=""
                      className="size-12 shrink-0 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <span
                      className={`flex size-12 shrink-0 items-center justify-center rounded-full ${STAT_TONE_CLASSES.purple}`}
                    >
                      <Building2 className="size-5" />
                    </span>
                  )}
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {company.name}
                      </p>
                      <Badge variant="secondary">{company.memberCount}人</Badge>
                    </div>
                    {company.description && (
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {company.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
