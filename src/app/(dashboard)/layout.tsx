import { Suspense } from "react";
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
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
        <header className="flex items-center gap-2 border-b border-border px-4 py-3">
          <SidebarTrigger />
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
