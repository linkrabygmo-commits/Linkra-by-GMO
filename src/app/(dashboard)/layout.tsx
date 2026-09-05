import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AppSidebar, AppSidebarSkeleton } from "@/components/layout/app-sidebar";
import { UserMenu } from "@/components/layout/user-menu";
import { HeaderUserMenu, HeaderUserMenuSkeleton } from "@/components/layout/header-user-menu";
import { getMyMemberStatus } from "@/lib/auth/session";
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
// 公開サイト(:root)とは別に、業務画面用の柔らかいライトテーマ(.app-shell)を
// dashboard/admin配下にだけ適用する。トップページの見た目には一切影響しない。
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell flex min-h-svh w-full bg-background text-foreground">
      <SidebarProvider>
        <Suspense fallback={<AppSidebarSkeleton />}>
          <AppSidebarGate
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
        <SidebarInset className="bg-background">
          <header className="flex items-center justify-between gap-2 border-b border-border bg-card/60 px-5 py-3 backdrop-blur-sm">
            <SidebarTrigger />
            <div className="flex items-center gap-3 sm:gap-5">
              <Link
                href="/"
                className="hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary sm:inline-flex"
              >
                サイトトップへ
                <ArrowUpRight className="size-3.5" />
              </Link>
              <Suspense fallback={<HeaderUserMenuSkeleton />}>
                <HeaderUserMenu />
              </Suspense>
            </div>
          </header>
          <main className="flex flex-1 flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

// getMyMemberStatus()を読んでからクライアント側のAppSidebarへ渡す、Suspense配下の
// 薄いラッパー。管理者/オーナーには「管理画面」への導線をサイドバーに常設する。
async function AppSidebarGate({ footer }: { footer: React.ReactNode }) {
  const memberStatus = await getMyMemberStatus();
  return <AppSidebar footer={footer} isAdmin={memberStatus === "admin"} />;
}
