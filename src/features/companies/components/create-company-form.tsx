"use client";

import { useActionState } from "react";
import { createCompanyAction } from "@/features/companies/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
        {pending ? "保存中..." : "会社情報を設定"}
      </Button>
    </form>
  );
}
