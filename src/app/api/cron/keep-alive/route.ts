import "server-only";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// SupabaseはFreeプラン(このプロジェクトの契約プラン)のDBを、約1週間アクセスが
// 無いと自動的に一時停止する。Vercel Cron経由でごく軽いSELECTを定期的に投げる
// ことで、その自動停止を防ぐだけのエンドポイント。cookieもユーザーセッションも
// 絡まないため、admin.tsのservice_roleクライアントではなく通常のanonキーで十分。
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { error } = await supabase.from("companies").select("id").limit(1);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, checkedAt: new Date().toISOString() });
}
