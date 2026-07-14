"use client";

import { useActionState } from "react";
import { createCompanyAction } from "@/features/companies/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COMPANY_TYPE_LABELS = {
  client: "クライアント企業",
  partner: "協力会社",
  group: "グループ会社",
} as const;

export function CreateCompanyForm() {
  const [state, action, pending] = useActionState(createCompanyAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">会社名</Label>
        <Input id="name" name="name" required />
        {state?.status === "error" && state.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="type">種別</Label>
        <Select name="type" required>
          <SelectTrigger id="type" className="w-full">
            <SelectValue placeholder="種別を選択" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(COMPANY_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.status === "error" && state.errors?.type && (
          <p className="text-sm text-destructive">{state.errors.type[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">説明(任意)</Label>
        <Textarea id="description" name="description" rows={3} />
        {state?.status === "error" && state.errors?.description && (
          <p className="text-sm text-destructive">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      {state?.status === "error" && state.message && (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "作成中..." : "会社を作成"}
      </Button>
    </form>
  );
}

export { COMPANY_TYPE_LABELS };
