import Link from "next/link";
import { siteConfig } from "@/config/site";

// requireAdmin()はcookieを読むため、各ページ側(Suspense配下)で呼び出す。
// レイアウト自体は静的な外枠のみ。
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-foreground">
            {siteConfig.name} 管理画面
          </span>
          <Link
            href="/admin/members"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            会員承認
          </Link>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ダッシュボードに戻る
        </Link>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
