import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { AdminNav, AdminNavSkeleton } from "@/components/layout/admin-nav";

// requireAdmin()はcookieを読むため、各ページ側(Suspense配下)で呼び出す。
// レイアウト自体は静的な外枠のみ。
// 公開サイト(:root)とは別に、業務画面用の柔らかいライトテーマ(.app-shell)を適用する。
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell flex min-h-full flex-1 flex-col bg-background text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card/60 px-6 py-3 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-semibold text-foreground">
            {siteConfig.name} 管理画面
          </span>
          <Suspense fallback={<AdminNavSkeleton />}>
            <AdminNav />
          </Suspense>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            サイトトップへ
            <ArrowUpRight className="size-3.5" />
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            ダッシュボードに戻る
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
