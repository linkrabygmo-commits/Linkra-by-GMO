import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AppSidebar, AppSidebarSkeleton } from "@/components/layout/app-sidebar";
import { BackButton, BackButtonSkeleton } from "@/components/layout/back-button";
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
        <SidebarInset className="bg-background">
          <header className="flex items-center justify-between gap-2 border-b border-border bg-card/60 px-5 py-3 backdrop-blur-sm">
            <SidebarTrigger />
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              サイトトップへ
              <ArrowUpRight className="size-3.5" />
            </Link>
          </header>
          <main className="flex flex-1 flex-col">
            <Suspense fallback={<BackButtonSkeleton className="mx-6 mt-4 sm:mx-10 sm:mt-6" />}>
              <div className="px-6 pt-4 sm:px-10 sm:pt-6">
                <BackButton />
              </div>
            </Suspense>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
