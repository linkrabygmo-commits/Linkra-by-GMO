import Link from "next/link";
import { Bell, ChevronDown, LogOut, Shield, User } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { getMyProfile } from "@/features/profile/repository";
import { logoutAction } from "@/features/auth/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ヘッダー右上のユーザー情報表示。サイドバー下部のUserMenu(折りたたみ時にも
// アクセスできるようアイコンのみになる導線)とは別に、常に見える場所にも
// アバター・氏名・肩書きを出す。通知ベルは既読管理の仕組みがまだ存在しないため、
// 件数バッジは付けずお知らせ一覧へのリンクとしてのみ機能する。
export async function HeaderUserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/login">ログイン</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/signup">会員登録</Link>
        </Button>
      </div>
    );
  }

  const profile = await getMyProfile();

  return (
    <div className="flex items-center gap-1 sm:gap-3">
      <Button asChild variant="ghost" size="icon" aria-label="お知らせ">
        <Link href="/announcements">
          <Bell className="size-5" />
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-1.5 text-left transition-colors hover:bg-muted sm:pr-2"
          >
            <Avatar className="size-8">
              <AvatarImage src={profile.avatarUrl ?? undefined} alt="" />
              <AvatarFallback>{profile.displayName.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <span className="hidden flex-col sm:flex">
              <span className="text-sm font-medium text-foreground">{profile.displayName}</span>
              <span className="text-xs text-muted-foreground">{profile.title ?? "会員"}</span>
            </span>
            <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
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
    </div>
  );
}

export function HeaderUserMenuSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="size-8 animate-pulse rounded-full bg-muted" />
      <div className="hidden flex-col gap-1 sm:flex">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="h-2.5 w-12 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
