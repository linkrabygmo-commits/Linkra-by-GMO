"use client";

import { useActionState } from "react";
import { createEventAction, updateEventAction } from "@/features/events/actions";
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
}

function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

interface EventFormProps {
  eventId?: string;
  defaultValues?: EventFormDefaultValues;
}

export function EventForm({ eventId, defaultValues }: EventFormProps) {
  const action = eventId ? updateEventAction.bind(null, eventId) : createEventAction;
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
        <Label htmlFor="description">説明(任意)</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description ?? undefined}
        />
      </div>

      <ImageUploadField
        name="coverImageUrl"
        label="カバー画像(任意)"
        scope="events"
        defaultValue={defaultValues?.coverImageUrl}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="audience">公開範囲</Label>
        <Select name="audience" defaultValue={defaultValues?.audience ?? "public"}>
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
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="location">開催場所(任意)</Label>
        <Input id="location" name="location" defaultValue={defaultValues?.location ?? undefined} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="startsAt">開始日時</Label>
          <Input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(defaultValues?.startsAt ?? null)}
            required
          />
          {state?.status === "error" && state.errors?.startsAt && (
            <p className="text-sm text-destructive">{state.errors.startsAt[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="endsAt">終了日時(任意)</Label>
          <Input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(defaultValues?.endsAt ?? null)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="capacity">定員(任意)</Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          min={1}
          defaultValue={defaultValues?.capacity ?? undefined}
        />
        {state?.status === "error" && state.errors?.capacity && (
          <p className="text-sm text-destructive">{state.errors.capacity[0]}</p>
        )}
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
        {pending ? "保存中..." : eventId ? "更新する" : "作成する"}
      </Button>
    </form>
  );
}
