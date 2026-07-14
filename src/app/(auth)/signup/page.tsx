import Link from "next/link";
import type { Metadata } from "next";
import { SignUpForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "新規登録",
};

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-xl font-semibold text-foreground">
        新規登録
      </h1>
      <SignUpForm />
      <p className="text-center text-sm text-muted-foreground">
        アカウントをお持ちの方は{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
