"use client";

import { useActionState } from "react";
import { requestAdAction } from "@/features/ads/actions";
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
import { ImageUploadField } from "@/components/storage/image-upload-field";

const PLACEMENT_LABELS = {
  top_hero: "トップページ(目立つ位置)",
  sidebar: "サイドバー",
  inline: "ページ内(自然な形で)",
} as const;

export function RequestAdForm() {
  const [state, action, pending] = useActionState(requestAdAction, undefined);

  if (state?.status === "success") {
    return (
      <p className="text-sm text-foreground" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">タイトル</Label>
        <Input id="title" name="title" required />
        {state?.status === "error" && state.errors?.title && (
          <p className="text-sm text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">説明(任意)</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="linkUrl">リンク先URL</Label>
        <Input id="linkUrl" name="linkUrl" placeholder="https://..." required />
        {state?.status === "error" && state.errors?.linkUrl && (
          <p className="text-sm text-destructive">{state.errors.linkUrl[0]}</p>
        )}
      </div>

      <ImageUploadField name="imageUrl" label="広告画像(任意)" scope="ads" />

      <div className="flex flex-col gap-2">
        <Label htmlFor="placement">掲載場所</Label>
        <Select name="placement" defaultValue="top_hero">
          <SelectTrigger id="placement" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {state?.status === "error" && state.message && (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "送信中..." : "申請する"}
      </Button>
    </form>
  );
}

export { PLACEMENT_LABELS };
