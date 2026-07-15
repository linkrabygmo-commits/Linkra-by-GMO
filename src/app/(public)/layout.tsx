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
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-foreground">
            {siteConfig.name}
          </Link>
          <Link
            href="/members"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            会員ディレクトリ
          </Link>
        </div>
        <Suspense fallback={null}>
          <AuthNav />
        </Suspense>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        {siteConfig.name}
      </footer>
    </div>
  );
}
