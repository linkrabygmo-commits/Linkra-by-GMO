import Link from "next/link";
import { ChevronsUpDown, LogOut, User } from "lucide-react";
import { getMyProfile } from "@/features/profile/repository";
import { logoutAction } from "@/features/auth/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export async function UserMenu() {
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
