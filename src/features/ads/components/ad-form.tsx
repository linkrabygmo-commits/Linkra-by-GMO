"use client";

import { useActionState } from "react";
import { createAdAction, updateAdAction } from "@/features/ads/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/storage/image-upload-field";

function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

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

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="linkUrl">リンク先URL</Label>
        <Input
          id="linkUrl"
          name="linkUrl"
          placeholder="https://..."
          defaultValue={defaultValues?.linkUrl}
          required
        />
        {state?.status === "error" && state.errors?.linkUrl && (
          <p className="text-sm text-destructive">{state.errors.linkUrl[0]}</p>
        )}
      </div>

      <ImageUploadField
        name="imageUrl"
        label="広告画像(推奨サイズ: 1200×900px、縦横比4:3)"
        scope="ads"
        defaultValue={defaultValues?.imageUrl}
      />
      {state?.status === "error" && state.errors?.imageUrl && (
        <p className="text-sm text-destructive">{state.errors.imageUrl[0]}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="startsAt">掲載開始日時(任意)</Label>
          <Input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(defaultValues?.startsAt ?? null)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="endsAt">掲載終了日時(任意)</Label>
          <Input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(defaultValues?.endsAt ?? null)}
          />
        </div>
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
