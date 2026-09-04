// このアプリは日本国内向けの業務画面で、管理者が入力する日時(イベント開始日時、
// 広告掲載期間など)は常にJST(日本標準時、UTC+9固定・夏時間なし)として扱う。
//
// <input type="datetime-local"> は "YYYY-MM-DDTHH:mm" というタイムゾーン情報を
// 一切含まない文字列を返す。これを `new Date(value)` でそのままパースすると、
// JSではタイムゾーン省略の日時文字列は「実行環境のローカルタイムゾーン」として
// 解釈される。Vercelのサーバーランタイムは基本UTCで動くため、管理者がJSTのつもり
// で入力した時刻がUTCとして保存されてしまい、実際のUTCより9時間進んだ誤った時刻が
// DBに書き込まれる。
//
// 同様に、保存済みのUTC ISO文字列を<input type="datetime-local">の初期値に戻す際、
// `date.getHours()`等のローカルタイムgetterを使うと、サーバー(UTC)でのレンダリング
// 結果とブラウザ(JST)でのハイドレーション結果が食い違い、表示のズレだけでなく
// Reactのハイドレーションエラーの原因にもなる。
//
// これらを避けるため、実行環境のタイムゾーンに依存しない、UTC基準の手動シフトで
// JST変換を行う。

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * <input type="datetime-local"> の値("YYYY-MM-DDTHH:mm")をJSTとして解釈し、
 * 対応するUTCのISO文字列を返す。保存時に使う。
 */
export function jstDatetimeLocalToIso(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match) {
    throw new Error(`不正な日時形式です: ${value}`);
  }
  const [, year, month, day, hour, minute] = match.map(Number as unknown as (s: string) => number);
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - JST_OFFSET_MS;
  return new Date(utcMs).toISOString();
}

/**
 * 保存済みのUTC ISO文字列を、<input type="datetime-local">用のJST基準
 * "YYYY-MM-DDTHH:mm"文字列に変換する。実行環境(サーバー/ブラウザ)のローカル
 * タイムゾーンに依存しないよう、UTC値を手動で+9時間シフトしてから
 * UTC系のgetterで読み出す(サーバー/クライアントで結果が一致することを保証する)。
 */
export function isoToJstDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const shifted = new Date(new Date(iso).getTime() + JST_OFFSET_MS);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}T${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}`;
}

/**
 * UTC ISO文字列を、JST基準で人間向けに整形する。`Intl`のtimeZoneを明示的に
 * "Asia/Tokyo"に固定するため、サーバー/ブラウザどちらの実行環境で呼んでも
 * 常に同じJST表記になる(timeZone省略時は実行環境のローカルタイムゾーンに
 * 依存してしまい、9時間ズレたりサーバー/クライアントで表示が食い違う原因になる)。
 */
export function formatJstDateTime(
  iso: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" },
): string {
  return new Date(iso).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", ...options });
}

export function formatJstDate(
  iso: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
): string {
  return new Date(iso).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo", ...options });
}
