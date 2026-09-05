"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { applyAsGuestAction } from "@/features/events/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function RequiredBadge() {
  return (
    <span className="inline-flex shrink-0 items-center rounded bg-destructive px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
      必須
    </span>
  );
}

function FormRow({
  htmlFor,
  label,
  required,
  children,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex shrink-0 items-center gap-1.5 sm:w-36">
        <Label
          htmlFor={htmlFor}
          className="text-sm font-medium whitespace-nowrap text-foreground"
        >
          {label}
        </Label>
        {required && <RequiredBadge />}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

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
    <form action={formAction} className="flex flex-col gap-5">
      <FormRow htmlFor="companyName" label="会社名" required>
        <Input
          id="companyName"
          name="companyName"
          required
          placeholder="例）GMO株式会社"
          className="h-11 rounded-lg bg-white px-3 text-sm"
        />
        {state?.status === "error" && state.errors?.companyName && (
          <p className="mt-1 text-sm text-destructive">
            {state.errors.companyName[0]}
          </p>
        )}
      </FormRow>

      <FormRow htmlFor="title" label="役職" required>
        <Input
          id="title"
          name="title"
          required
          placeholder="例）営業部 部長"
          className="h-11 rounded-lg bg-white px-3 text-sm"
        />
        {state?.status === "error" && state.errors?.title && (
          <p className="mt-1 text-sm text-destructive">
            {state.errors.title[0]}
          </p>
        )}
      </FormRow>

      <FormRow htmlFor="name" label="お名前" required>
        <Input
          id="name"
          name="name"
          required
          placeholder="例）山田 太郎"
          className="h-11 rounded-lg bg-white px-3 text-sm"
        />
        {state?.status === "error" && state.errors?.name && (
          <p className="mt-1 text-sm text-destructive">
            {state.errors.name[0]}
          </p>
        )}
      </FormRow>

      <FormRow htmlFor="email" label="メールアドレス" required>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="例）taro.yamada@example.com"
          className="h-11 rounded-lg bg-white px-3 text-sm"
        />
        {state?.status === "error" && state.errors?.email && (
          <p className="mt-1 text-sm text-destructive">
            {state.errors.email[0]}
          </p>
        )}
      </FormRow>

      <FormRow htmlFor="phone" label="電話番号">
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="例）090-1234-5678"
          className="h-11 rounded-lg bg-white px-3 text-sm"
        />
      </FormRow>

      {state?.status === "error" && state.message && (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="mt-1 h-12 w-full gap-2 rounded-lg text-base font-semibold"
      >
        <Send className="size-4" />
        {pending ? "送信中..." : "ゲストとして申し込む"}
      </Button>
    </form>
  );
}
