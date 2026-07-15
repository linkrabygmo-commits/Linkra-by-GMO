import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";

export async function AuthNav() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">ログイン</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/signup">会員登録</Link>
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/dashboard">ダッシュボードへ</Link>
    </Button>
  );
}
