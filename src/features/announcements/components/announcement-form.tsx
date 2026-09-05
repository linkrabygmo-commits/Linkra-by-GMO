"use client";

import { useActionState } from "react";
import {
  createAnnouncementAction,
  updateAnnouncementAction,
} from "@/features/announcements/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { ImageUploadField } from "@/components/storage/image-upload-field";

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

export function AnnouncementForm({
  announcementId,
  defaultValues,
}: AnnouncementFormProps) {
  const action = announcementId
    ? updateAnnouncementAction.bind(null, announcementId)
    : createAnnouncementAction;
  const [state, formAction, pending] = useActionState(action, undefined);

  const fieldError = (name: "title" | "body" | "coverImageUrl" | "status") =>
    state?.status === "error" ? state.errors?.[name]?.[0] : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormField
        htmlFor="title"
        label="タイトル"
        required
        error={fieldError("title")}
      >
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          required
        />
      </FormField>

      <FormField
        htmlFor="body"
        label="本文"
        required
        error={fieldError("body")}
      >
        <Textarea
          id="body"
          name="body"
          rows={8}
          defaultValue={defaultValues?.body}
          required
        />
      </FormField>

      <ImageUploadField
        name="coverImageUrl"
        label="カバー画像(任意、推奨サイズ: 1200×630px、横長)"
        scope="announcements"
        defaultValue={defaultValues?.coverImageUrl}
      />

      <FormField htmlFor="status" label="公開状態">
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
      </FormField>

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
