import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { getEventById, listEventApplications } from "@/features/events/repository";
import { formatJstDateTime } from "@/lib/datetime";

// 管理者による確定作業は不要にしたため、pending/confirmedは区別せず「済」として出力する
// (pendingは過去データにのみ残り得る)。
const STATUS_LABELS = {
  pending: "済",
  confirmed: "済",
  cancelled: "キャンセル済み",
} as const;

// カンマ・改行・ダブルクォートを含む値はダブルクォートで囲み、中の"は""にエスケープする(RFC 4180)。
function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCsvRow(cells: string[]): string {
  return cells.map(csvEscape).join(",");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  // requireAdmin()は管理者以外ならredirectを投げるが、このルートはAPI(fetchではなくブラウザの
  // 直リンクでダウンロードさせる想定)なので、それで問題ない(ログイン画面へ遷移する)。
  await requireAdmin();

  const { eventId } = await params;

  const [event, applications] = await Promise.all([
    getEventById(eventId),
    listEventApplications(eventId),
  ]);

  if (!event) {
    return NextResponse.json({ error: "イベントが見つかりません。" }, { status: 404 });
  }

  // 出力項目: 会社名, 役職, 名前, メールアドレス, 電話番号(必須5項目、この並び)
  // + 管理上あると便利な申込種別・ステータス・申込日時を追加。
  // 全件出力(キャンセル済みも含む)。会員/ゲストどちらも対象。
  const header = [
    "会社名",
    "役職",
    "名前",
    "メールアドレス",
    "電話番号",
    "申込種別",
    "ステータス",
    "参加",
    "申込日時",
  ];

  const rows = applications.map((application) =>
    toCsvRow([
      application.companyName ?? "",
      application.title ?? "",
      application.name,
      application.email ?? "",
      application.phone ?? "",
      application.type === "member" ? "会員" : "ゲスト",
      STATUS_LABELS[application.status],
      application.attended ? "参加済み" : "",
      formatJstDateTime(application.createdAt, { dateStyle: "short", timeStyle: "short" }),
    ]),
  );

  // ExcelでUTF-8のCSVを開くと文字化けするため、先頭にBOMを付与する。
  const BOM = "\uFEFF";
  const csv = BOM + [toCsvRow(header), ...rows].join("\r\n") + "\r\n";

  const filename = `${event.title}_申込者一覧.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications.csv"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "no-store",
    },
  });
}
