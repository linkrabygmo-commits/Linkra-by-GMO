"use client";

import { useActionState } from "react";
import { applyAsGuestAction } from "@/features/events/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GuestApplicationForm({ eventId }: { eventId: string }) {
  const action = applyAsGuestAction.bind(null, eventId);
  const [state, formAction, pending] = useActionState(action, undefined);

  if (state?.status === "success") {
    return (
      <p className="text-sm text-foreground" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">お名前</Label>
        <Input id="name" name="name" required />
        {state?.status === "error" && state.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input id="email" name="email" type="email" required />
        {state?.status === "error" && state.errors?.email && (
          <p className="text-sm text-destructive">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">電話番号(任意)</Label>
        <Input id="phone" name="phone" type="tel" />
      </div>

      {state?.status === "error" && state.message && (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "送信中..." : "ゲストとして申し込む"}
      </Button>
    </form>
  );
}
