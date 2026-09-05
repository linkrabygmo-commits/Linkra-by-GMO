"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Building2, Search } from "lucide-react";
import type { CompanyDto } from "@/features/companies/repository";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="企業名・概要で検索"
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">
          {query ? "該当する企業が見つかりません。" : "まだ会社が登録されていません。"}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((company) => (
            <li key={company.id}>
              <Link
                href={`/companies/${company.id}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {company.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={company.logoUrl}
                    alt=""
                    className="size-12 shrink-0 rounded-full border border-border object-cover"
                  />
                ) : (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Building2 className="size-5" />
                  </span>
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{company.name}</p>
                    <Badge variant="secondary">{company.memberCount}人</Badge>
                  </div>
                  {company.description && (
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {company.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
