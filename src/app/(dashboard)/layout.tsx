import { Suspense } from "react";
import Link from "next/link";
import { AppSidebar, AppSidebarSkeleton } from "@/components/layout/app-sidebar";
import { UserMenu } from "@/components/layout/user-menu";
import {
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// このレイアウト自体はcookieを読まない静的な外枠。認証チェックは各ページ側
// (Suspense配下のコンポーネント)で行い、Cache Componentsの静的シェルを維持する。
// 公開サイトの落ち着いたダークトーンと印象を揃えるため、dashboard/admin配下は
// 常時ダークテーマ(.dark)で表示する(OS/ブラウザのテーマ設定に関わらず固定)。
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark flex min-h-svh w-full bg-background text-foreground">
      <SidebarProvider>
        <Suspense fallback={<AppSidebarSkeleton />}>
          <AppSidebar
            footer={
              <Suspense
                fallback={
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuSkeleton showIcon />
                    </SidebarMenuItem>
                  </SidebarMenu>
                }
              >
                <UserMenu />
              </Suspense>
            }
          />
        </Suspense>
        <SidebarInset>
          <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <SidebarTrigger />
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              サイトトップへ
            </Link>
          </header>
          <main className="flex flex-1 flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
