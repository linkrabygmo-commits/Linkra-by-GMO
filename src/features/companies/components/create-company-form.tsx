"use client";

import { useActionState } from "react";
import { createCompanyAction } from "@/features/companies/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { ImageUploadField } from "@/components/storage/image-upload-field";

export function CreateCompanyForm() {
  const [state, action, pending] = useActionState(
    createCompanyAction,
    undefined,
  );

  const fieldError = (name: "name" | "description" | "logoUrl") =>
    state?.status === "error" ? state.errors?.[name]?.[0] : undefined;

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormField
        htmlFor="name"
        label="会社名"
        required
        error={fieldError("name")}
      >
        <Input id="name" name="name" required />
      </FormField>

      <FormField
        htmlFor="description"
        label="説明"
        error={fieldError("description")}
      >
        <Textarea id="description" name="description" rows={3} />
      </FormField>

      <ImageUploadField
        name="logoUrl"
        label="ロゴ画像(任意、推奨サイズ: 400×400px、正方形)"
        scope="companies"
      />

      {state?.status === "error" && state.message && (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "保存中..." : "プロフィールを設定"}
      </Button>
    </form>
  );
}
