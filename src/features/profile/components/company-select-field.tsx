"use client";

import { useState, useTransition } from "react";
import { createCompanyForProfileAction } from "@/features/companies/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const COMPANY_NONE_VALUE = "__none__";
const CREATE_NEW_VALUE = "__create_new__";

interface CompanyOption {
  id: string;
  name: string;
}

interface CompanySelectFieldProps {
  initialCompanies: CompanyOption[];
  defaultCompanyId: string | null;
}

// プルダウンに既存の会社が無ければ、その場で新規登録して選択状態にする。
// 一覧はサーバーから初期値を受け取り、新規登録した会社をクライアント側で
// 追加していく(登録直後にページ全体を再取得しなくても選べるようにするため)。
export function CompanySelectField({
  initialCompanies,
  defaultCompanyId,
}: CompanySelectFieldProps) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [selectedId, setSelectedId] = useState(defaultCompanyId ?? COMPANY_NONE_VALUE);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleValueChange(value: string) {
    if (value === CREATE_NEW_VALUE) {
      setShowCreateForm(true);
      setError(null);
      return;
    }
    setSelectedId(value);
  }

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      const result = await createCompanyForProfileAction(newCompanyName);

      if (result.status === "error") {
        setError(result.message);
        return;
      }

      setCompanies((prev) =>
        [...prev, result.company].sort((a, b) => a.name.localeCompare(b.name, "ja")),
      );
      setSelectedId(result.company.id);
      setShowCreateForm(false);
      setNewCompanyName("");
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="companyId">会社名(任意)</Label>
      <input type="hidden" name="companyId" value={selectedId} />
      <Select value={selectedId} onValueChange={handleValueChange}>
        <SelectTrigger id="companyId" className="w-full">
          <SelectValue placeholder="会社を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={COMPANY_NONE_VALUE}>未設定</SelectItem>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
          <SelectItem value={CREATE_NEW_VALUE}>＋ 新しい会社名を登録する</SelectItem>
        </SelectContent>
      </Select>

      {showCreateForm && (
        <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
          <Label htmlFor="newCompanyName">新しい会社名</Label>
          <div className="flex gap-2">
            <Input
              id="newCompanyName"
              value={newCompanyName}
              onChange={(event) => setNewCompanyName(event.target.value)}
              placeholder="株式会社サンプル"
            />
            <Button
              type="button"
              onClick={handleCreate}
              disabled={isPending || !newCompanyName.trim()}
            >
              {isPending ? "登録中..." : "登録する"}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-fit"
            onClick={() => {
              setShowCreateForm(false);
              setNewCompanyName("");
              setError(null);
            }}
          >
            キャンセル
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
