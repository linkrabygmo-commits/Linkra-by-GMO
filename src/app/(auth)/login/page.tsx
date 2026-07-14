import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "ログイン",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-xl font-semibold text-foreground">
        ログイン
      </h1>
      <LoginForm />
      <p className="text-center text-sm text-muted-foreground">
        アカウントをお持ちでない方は{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          新規登録
        </Link>
      </p>
    </div>
  );
}
