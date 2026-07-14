import { Suspense } from "react";
import { verifySession } from "@/lib/auth/session";

export default function DashboardHomePage() {
  return (
    <div className="flex flex-1 flex-col gap-2 px-6 py-10">
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <Greeting />
      </Suspense>
    </div>
  );
}

async function Greeting() {
  const user = await verifySession();

  return (
    <>
      <h1 className="text-2xl font-semibold text-foreground">
        ようこそ、{user.email} さん
      </h1>
      <p className="text-muted-foreground">ログインに成功しました。</p>
    </>
  );
}
