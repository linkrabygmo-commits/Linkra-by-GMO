import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCurrentUser, getMyMemberStatus } from "@/lib/auth/session";

export async function AuthNav() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center gap-3 sm:gap-5">
        <Link
          href="/login"
          className="text-sm whitespace-nowrap text-white/75 transition-colors hover:text-white"
        >
          ログイン
        </Link>
        <Link
          href="/signup"
          className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-3.5 py-2 text-sm font-medium whitespace-nowrap text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.8)] transition-transform hover:scale-[1.03] sm:px-4"
        >
          会員登録
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    );
  }

  const memberStatus = await getMyMemberStatus();

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {memberStatus === "admin" && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 transition-colors hover:border-white/40 hover:text-white"
        >
          管理者ページへ
        </Link>
      )}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 transition-colors hover:border-white/40 hover:text-white"
      >
        ダッシュボードへ
      </Link>
    </div>
  );
}
