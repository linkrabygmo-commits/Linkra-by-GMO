"use client";

import { useActionState } from "react";
import {
  createEventAction,
  updateEventAction,
} from "@/features/events/actions";
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
import { isoToJstDatetimeLocal } from "@/lib/datetime";

const AUDIENCE_LABELS = {
  public: "一般公開(ゲストも参加可)",
  member_only: "会員限定",
} as const;

interface EventFormDefaultValues {
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  audience: "public" | "member_only";
  location: string | null;
  startsAt: string;
  endsAt: string | null;
  capacity: number | null;
  applicationDeadline: string | null;
}

interface EventFormProps {
  eventId?: string;
  defaultValues?: EventFormDefaultValues;
}

export function EventForm({ eventId, defaultValues }: EventFormProps) {
  const action = eventId
    ? updateEventAction.bind(null, eventId)
    : createEventAction;
  const [state, formAction, pending] = useActionState(action, undefined);

  const fieldError = (
    name:
      | "title"
      | "description"
      | "coverImageUrl"
      | "audience"
      | "location"
      | "startsAt"
      | "endsAt"
      | "capacity"
      | "applicationDeadline",
  ) => (state?.status === "error" ? state.errors?.[name]?.[0] : undefined);

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

      <FormField htmlFor="description" label="説明">
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description ?? undefined}
        />
      </FormField>

      <ImageUploadField
        name="coverImageUrl"
        label="カバー画像(任意、推奨サイズ: 1200×900px、縦横比4:3)"
        scope="events"
        defaultValue={defaultValues?.coverImageUrl}
      />

      <FormField htmlFor="audience" label="公開範囲">
        <Select
          name="audience"
          defaultValue={defaultValues?.audience ?? "public"}
        >
          <SelectTrigger id="audience" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(AUDIENCE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField htmlFor="location" label="開催場所">
        <Input
          id="location"
          name="location"
          defaultValue={defaultValues?.location ?? undefined}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          htmlFor="startsAt"
          label="開始日時"
          required
          error={fieldError("startsAt")}
        >
          <Input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={isoToJstDatetimeLocal(defaultValues?.startsAt)}
            required
          />
        </FormField>

        <FormField htmlFor="endsAt" label="終了日時">
          <Input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={isoToJstDatetimeLocal(defaultValues?.endsAt)}
          />
        </FormField>
      </div>

      <FormField
        htmlFor="applicationDeadline"
        label="回答期限"
        hint="設定すると、この日時を過ぎた後は参加申込を受け付けなくなります。"
        error={fieldError("applicationDeadline")}
      >
        <Input
          id="applicationDeadline"
          name="applicationDeadline"
          type="datetime-local"
          defaultValue={isoToJstDatetimeLocal(
            defaultValues?.applicationDeadline,
          )}
        />
      </FormField>

      <FormField htmlFor="capacity" label="定員" error={fieldError("capacity")}>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          min={1}
          defaultValue={defaultValues?.capacity ?? undefined}
        />
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
        {pending ? "保存中..." : eventId ? "更新する" : "作成する"}
      </Button>
    </form>
  );
}
