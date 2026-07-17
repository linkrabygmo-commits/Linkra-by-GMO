import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AdminNav, AdminNavSkeleton } from "@/components/layout/admin-nav";
import { BackButton, BackButtonSkeleton } from "@/components/layout/back-button";
import { LinkraLogo } from "@/components/brand/linkra-logo";

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
      <header className="flex flex-col gap-3 border-b border-border bg-card/60 px-6 py-3 backdrop-blur-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <LinkraLogo size="md" tone="dark" href="/dashboard" />
            <span className="text-sm font-semibold text-foreground">管理画面</span>
          </div>
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
      <main className="flex flex-1 flex-col">
        <Suspense fallback={<BackButtonSkeleton className="mx-6 mt-4 sm:mx-10 sm:mt-6" />}>
          <BackButton className="mx-6 mt-4 sm:mx-10 sm:mt-6" />
        </Suspense>
        {children}
      </main>
    </div>
  );
}
