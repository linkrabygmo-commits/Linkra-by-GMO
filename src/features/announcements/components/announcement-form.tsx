"use client";

import { useActionState } from "react";
import { createAnnouncementAction, updateAnnouncementAction } from "@/features/announcements/actions";
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

const STATUS_LABELS = {
  draft: "下書き",
  published: "公開する",
} as const;

interface AnnouncementFormDefaultValues {
  title: string;
  body: string;
  coverImageUrl: string | null;
  status: "draft" | "published";
}

interface AnnouncementFormProps {
  announcementId?: string;
  defaultValues?: AnnouncementFormDefaultValues;
}

export function AnnouncementForm({ announcementId, defaultValues }: AnnouncementFormProps) {
  const action = announcementId
    ? updateAnnouncementAction.bind(null, announcementId)
    : createAnnouncementAction;
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">タイトル</Label>
        <Input id="title" name="title" defaultValue={defaultValues?.title} required />
        {state?.status === "error" && state.errors?.title && (
          <p className="text-sm text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="body">本文</Label>
        <Textarea id="body" name="body" rows={8} defaultValue={defaultValues?.body} required />
        {state?.status === "error" && state.errors?.body && (
          <p className="text-sm text-destructive">{state.errors.body[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="coverImageUrl">カバー画像URL(任意)</Label>
        <Input
          id="coverImageUrl"
          name="coverImageUrl"
          placeholder="https://..."
          defaultValue={defaultValues?.coverImageUrl ?? undefined}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="status">公開状態</Label>
        <Select name="status" defaultValue={defaultValues?.status ?? "draft"}>
          <SelectTrigger id="status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
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
      {state?.status === "success" && (
        <p className="text-sm text-foreground" role="status">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "保存中..." : announcementId ? "更新する" : "作成する"}
      </Button>
    </form>
  );
}
