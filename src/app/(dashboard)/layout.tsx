import Link from "next/link";
import { logoutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

// このレイアウト自体はcookieを読まない静的な外枠。認証チェックは各ページ側
// (Suspense配下のコンポーネント)で行い、Cache Componentsの静的シェルを維持する。
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-semibold text-foreground">
            {siteConfig.name}
          </Link>
          <Link
            href="/companies"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            企業一覧
          </Link>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm">
            ログアウト
          </Button>
        </form>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
