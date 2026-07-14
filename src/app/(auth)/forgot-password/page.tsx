import Link from "next/link";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "パスワード再設定",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-xl font-semibold text-foreground">
        パスワード再設定
      </h1>
      <p className="text-center text-sm text-muted-foreground">
        登録済みのメールアドレスを入力してください。再設定用のリンクをお送りします。
      </p>
      <ForgotPasswordForm />
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-primary hover:underline">
          ログインに戻る
        </Link>
      </p>
    </div>
  );
}
