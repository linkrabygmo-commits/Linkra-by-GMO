import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "新しいパスワードを設定",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-xl font-semibold text-foreground">
        新しいパスワードを設定
      </h1>
      <ResetPasswordForm />
    </div>
  );
}
