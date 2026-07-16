import Link from "next/link";
import { siteConfig } from "@/config/site";

// requireAdmin()はcookieを読むため、各ページ側(Suspense配下)で呼び出す。
// レイアウト自体は静的な外枠のみ。
// 公開サイトの落ち着いたダークトーンと印象を揃えるため、常時ダークテーマ(.dark)で表示する。
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark flex min-h-full flex-1 flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-foreground">
            {siteConfig.name} 管理画面
          </span>
          <Link
            href="/admin/members"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            会員管理
          </Link>
          <Link
            href="/admin/ads"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            広告承認
          </Link>
          <Link
            href="/admin/events"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            イベント管理
          </Link>
          <Link
            href="/admin/announcements"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            お知らせ管理
          </Link>
          <Link
            href="/admin/companies/new"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            プロフィールを設定
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            サイトトップへ
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ダッシュボードに戻る
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
