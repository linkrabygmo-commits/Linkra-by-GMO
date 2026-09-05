"use client";

import { useActionState } from "react";
import {
  requestPasswordResetAction,
  setNewPasswordAction,
} from "@/features/password-reset/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// メール送信は行わない。「パスワードを忘れた方」はここでメールアドレスを
// 入力して管理者に承認を依頼し、承認されたら同じ画面に戻ってきて(もう一度
// メールアドレスを入力して)新しいパスワードを設定する、という2段階の流れを
// この1コンポーネントで扱う。
export function ForgotPasswordForm() {
  const [requestState, requestAction, requestPending] = useActionState(
    requestPasswordResetAction,
    undefined,
  );
  const [setState, setAction, setPending] = useActionState(
    setNewPasswordAction,
    undefined,
  );

  if (requestState?.status === "ready") {
    return (
      <form action={setAction} className="flex flex-col gap-4">
        <p
          className="rounded-lg bg-accent px-4 py-3 text-sm text-accent-foreground"
          role="status"
        >
          {requestState.message}
        </p>
        <input type="hidden" name="requestId" value={requestState.requestId} />

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">新しいパスワード</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          {setState?.status === "error" && setState.errors?.password && (
            <p className="text-sm text-destructive">{setState.errors.password[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="passwordConfirm">新しいパスワード(確認)</Label>
          <Input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            required
          />
          {setState?.status === "error" && setState.errors?.passwordConfirm && (
            <p className="text-sm text-destructive">
              {setState.errors.passwordConfirm[0]}
            </p>
          )}
        </div>

        {setState?.status === "error" && setState.message && (
          <p className="text-sm text-destructive" role="alert">
            {setState.message}
          </p>
        )}

        <Button type="submit" disabled={setPending} className="mt-2">
          {setPending ? "設定中..." : "設定"}
        </Button>
      </form>
    );
  }

  return (
    <form action={requestAction} className="flex flex-col gap-4">
      {requestState?.status === "pending" && (
        <p
          className="rounded-lg bg-accent px-4 py-3 text-sm text-accent-foreground"
          role="status"
        >
          {requestState.message}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        {requestState?.status === "error" && requestState.errors?.email && (
          <p className="text-sm text-destructive">{requestState.errors.email[0]}</p>
        )}
      </div>

      {requestState?.status === "error" && requestState.message && (
        <p className="text-sm text-destructive" role="alert">
          {requestState.message}
        </p>
      )}

      <Button type="submit" disabled={requestPending} className="mt-2">
        {requestPending
          ? "送信中..."
          : requestState?.status === "pending"
            ? "承認状況を確認する"
            : "管理者にリセットを依頼する"}
      </Button>
    </form>
  );
}
