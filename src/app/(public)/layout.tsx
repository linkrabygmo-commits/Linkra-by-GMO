import { Suspense } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { AuthNav } from "@/components/layout/auth-nav";

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
            <Link
              href="/"
              className="truncate text-sm font-semibold whitespace-nowrap text-white"
            >
              {siteConfig.name}
            </Link>
            <Link
              href="/members"
              className="hidden text-sm whitespace-nowrap text-white/70 transition-colors hover:text-white sm:inline"
            >
              会員ディレクトリ
            </Link>
          </div>
          <Suspense fallback={null}>
            <AuthNav />
          </Suspense>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        {siteConfig.name}
      </footer>
    </div>
  );
}
