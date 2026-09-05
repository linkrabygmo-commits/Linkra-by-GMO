"use client";

import { useActionState } from "react";
import { createAdAction, updateAdAction } from "@/features/ads/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { ImageUploadField } from "@/components/storage/image-upload-field";
import { isoToJstDatetimeLocal } from "@/lib/datetime";

interface AdFormDefaultValues {
  linkUrl: string;
  imageUrl: string | null;
  startsAt: string | null;
  endsAt: string | null;
}

interface AdFormProps {
  adId?: string;
  defaultValues?: AdFormDefaultValues;
}

export function AdForm({ adId, defaultValues }: AdFormProps) {
  const action = adId ? updateAdAction.bind(null, adId) : createAdAction;
  const [state, formAction, pending] = useActionState(action, undefined);

  const fieldError = (name: "linkUrl" | "imageUrl" | "startsAt" | "endsAt") =>
    state?.status === "error" ? state.errors?.[name]?.[0] : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormField
        htmlFor="linkUrl"
        label="リンク先URL"
        required
        error={fieldError("linkUrl")}
      >
        <Input
          id="linkUrl"
          name="linkUrl"
          placeholder="https://..."
          defaultValue={defaultValues?.linkUrl}
          required
        />
      </FormField>

      <ImageUploadField
        name="imageUrl"
        label="広告画像(推奨サイズ: 1200×900px、縦横比4:3)"
        scope="ads"
        defaultValue={defaultValues?.imageUrl}
      />
      {fieldError("imageUrl") && (
        <p className="text-sm text-destructive">{fieldError("imageUrl")}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField htmlFor="startsAt" label="掲載開始日時">
          <Input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={isoToJstDatetimeLocal(defaultValues?.startsAt)}
          />
        </FormField>

        <FormField htmlFor="endsAt" label="掲載終了日時">
          <Input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={isoToJstDatetimeLocal(defaultValues?.endsAt)}
          />
        </FormField>
      </div>

      {state?.status === "error" && state.message && (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}
      {state?.status === "success" && (
        <p className="text-sm text-foreground" role="status">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "保存中..." : adId ? "更新する" : "作成する"}
      </Button>
    </form>
  );
}
