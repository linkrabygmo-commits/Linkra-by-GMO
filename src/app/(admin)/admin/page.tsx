import { Suspense } from "react";
import Link from "next/link";
import { listPendingMembers } from "@/features/admin/repository";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">概要</h1>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <OverviewContent />
      </Suspense>
    </div>
  );
}

async function OverviewContent() {
  const pending = await listPendingMembers();

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
      <div>
        <p className="text-sm text-muted-foreground">承認待ちの会員</p>
        <p className="text-2xl font-semibold text-foreground">{pending.length}人</p>
      </div>
      <Button asChild>
        <Link href="/admin/members">確認する</Link>
      </Button>
    </div>
  );
}
