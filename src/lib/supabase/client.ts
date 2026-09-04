import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// このクライアントは現状 ImageUploadField の署名付きURLアップロード専用で、
// アップロード自体の認可は署名付きトークン側が持っているためログインセッションを
// 一切必要としない。にもかかわらず createBrowserClient() はデフォルトで
// autoRefreshToken/persistSession が有効なフルのGoTrueClientを生成し、
// マウントされるたびに独自のバックグラウンド更新タイマーが走り出す。
// これがミドルウェア(proxy.ts)側のCookieベースのトークン更新と同じ
// リフレッシュトークンを取り合い、片方が「Invalid Refresh Token: Already Used」
// で失敗してセッションをクリアしてしまう既知の競合(supabase/auth-js#213,
// supabase/supabase#18981)を引き起こし得る。Cookieはブラウザ全体で共有される
// ため、この失敗は「アップロードフォームを開いているタブ」とは無関係な、
// 同じブラウザの別タブ(管理者のログインセッション)まで巻き込んで
// 強制ログアウトを引き起こす。このクライアントはセッションを一切使わないので、
// 明示的に無効化しておく。
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );
}
