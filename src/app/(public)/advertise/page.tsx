import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getMyMemberStatus } from "@/lib/auth/session";
import { listMyAdRequests } from "@/features/ads/repository";
import {
  RequestAdForm,
  PLACEMENT_LABELS,
} from "@/features/ads/components/request-ad-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "広告掲載について",
};

export default function AdvertisePage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-6 py-16">
      <h1 className="text-xl font-semibold text-foreground">広告掲載について</h1>
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <AdvertiseContent />
      </Suspense>
    </div>
  );
}

const STATUS_LABELS = {
  pending: "審査中",
  approved: "承認済み",
  rejected: "見送り",
} as const;

async function AdvertiseContent() {
  const memberStatus = await getMyMemberStatus();
  const canRequest = memberStatus === "approved" || memberStatus === "admin";

  if (!canRequest) {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        広告掲載には会員登録と運営の承認が必要です。
        <br />
        まずは
        <Link href="/signup" className="mx-1 text-primary hover:underline">
          会員登録
        </Link>
        のうえ、詳細は運営までお問い合わせください。
      </p>
    );
  }

  const myRequests = await listMyAdRequests();

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted-foreground">
        Linkra by GMOでは、会員特典として広告掲載を承っています。以下のフォームからお気軽にご相談ください。
      </p>

      <RequestAdForm />

      {myRequests.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-border pt-6">
          <h2 className="text-sm font-medium text-foreground">申請履歴</h2>
          <ul className="flex flex-col gap-2">
            {myRequests.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
              >
                <div>
                  <p className="text-foreground">{request.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {PLACEMENT_LABELS[request.placement]}
                  </p>
                </div>
                <Badge
                  variant={
                    request.status === "approved"
                      ? "default"
                      : request.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {STATUS_LABELS[request.status]}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
