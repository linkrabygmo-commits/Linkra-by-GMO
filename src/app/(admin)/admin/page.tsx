import { Suspense } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { listPendingMembers } from "@/features/admin/repository";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-8 sm:px-10 sm:py-10">
      <div className="app-hero flex flex-col gap-2 rounded-2xl border border-border px-8 py-10 sm:px-10">
        <span className="h-1 w-8 rounded-full bg-primary" />
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          管理画面
        </h1>
        <p className="text-sm text-muted-foreground">
          会員・広告・イベント・お知らせの運営状況をここから確認できます。
        </p>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <OverviewContent />
      </Suspense>
    </div>
  );
}

async function OverviewContent() {
  const pending = await listPendingMembers();

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-6 py-5 ring-1 ring-foreground/10">
      <div className="flex items-center gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Users className="size-5" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">承認待ちの会員</p>
          <p className="text-2xl font-semibold text-foreground">{pending.length}人</p>
        </div>
      </div>
      <Button asChild>
        <Link href="/admin/members">確認する</Link>
      </Button>
    </div>
  );
}
