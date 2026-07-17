import { Suspense } from "react";
import { AuthNav } from "@/components/layout/auth-nav";
import { LinkraLogo } from "@/components/brand/linkra-logo";

// 会員/企業ディレクトリ・イベント・お知らせはサイドバー配下((dashboard)配下)に
// 統合したため、このレイアウトはトップページ("/")専用のシンプルな外枠になる。
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[oklch(0.12_0.05_264/92%)] px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <LinkraLogo size="md" tone="light" href="/" className="truncate whitespace-nowrap" />
          <Suspense fallback={null}>
            <AuthNav />
          </Suspense>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="flex flex-col items-center gap-2 border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        <LinkraLogo size="sm" tone="dark" href="/" />
      </footer>
    </div>
  );
}
