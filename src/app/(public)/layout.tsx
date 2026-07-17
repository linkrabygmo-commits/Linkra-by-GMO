import { Suspense } from "react";
import Link from "next/link";
import { AuthNav } from "@/components/layout/auth-nav";
import { BackButton, BackButtonSkeleton } from "@/components/layout/back-button";
import { LinkraLogo } from "@/components/brand/linkra-logo";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[oklch(0.12_0.05_264/92%)] px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <LinkraLogo size="md" tone="light" href="/" className="truncate whitespace-nowrap" />
            <Link
              href="/members"
              className="hidden text-sm whitespace-nowrap text-white/70 transition-colors hover:text-white sm:inline"
            >
              会員ディレクトリ
            </Link>
            <Link
              href="/companies"
              className="hidden text-sm whitespace-nowrap text-white/70 transition-colors hover:text-white sm:inline"
            >
              企業ディレクトリ
            </Link>
            <Link
              href="/events"
              className="hidden text-sm whitespace-nowrap text-white/70 transition-colors hover:text-white sm:inline"
            >
              イベント
            </Link>
            <Link
              href="/announcements"
              className="hidden text-sm whitespace-nowrap text-white/70 transition-colors hover:text-white sm:inline"
            >
              お知らせ
            </Link>
          </div>
          <Suspense fallback={null}>
            <AuthNav />
          </Suspense>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <Suspense fallback={<BackButtonSkeleton className="mx-6 mt-4" />}>
          <BackButton className="mx-6 mt-4" />
        </Suspense>
        {children}
      </main>
      <footer className="flex flex-col items-center gap-2 border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        <LinkraLogo size="sm" tone="dark" href="/" />
      </footer>
    </div>
  );
}
