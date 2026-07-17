import Link from "next/link";
import { ChevronsUpDown, LogOut, Shield, User } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { getMyProfile } from "@/features/profile/repository";
import { logoutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

// 会員ディレクトリ等の公開ページもこのサイドバー配下に統合したため、
// 未ログインの訪問者でもレンダリングされる。getMyProfile()はverifySession()
// 経由でログインを必須にするため、先にgetCurrentUser()で分岐する。
export async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem className="flex gap-2 px-2 py-1.5 group-data-[collapsible=icon]:hidden">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href="/login">ログイン</Link>
          </Button>
          <Button asChild size="sm" className="flex-1">
            <Link href="/signup">会員登録</Link>
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const profile = await getMyProfile();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="size-6">
                <AvatarImage src={profile.avatarUrl ?? undefined} alt="" />
                <AvatarFallback>
                  {profile.displayName.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <span className="flex flex-col overflow-hidden text-left">
                <span className="truncate text-sm font-medium">
                  {profile.displayName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {profile.email}
                </span>
              </span>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User />
                プロフィール
              </Link>
            </DropdownMenuItem>
            {profile.memberStatus === "admin" && (
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <Shield />
                  管理画面
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild variant="destructive">
              <form action={logoutAction} className="w-full">
                <button type="submit" className="flex w-full items-center gap-2">
                  <LogOut />
                  ログアウト
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
