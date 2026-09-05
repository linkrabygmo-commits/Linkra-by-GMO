import { cn } from "@/lib/utils";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
const URL_TEST = /^https?:\/\//;

// イベント説明・お知らせ本文などの自由記述テキスト内のURLを、クリックできる
// リンクに変換して表示する。データ自体はプレーンテキストのまま(DB側の変更
// は不要)で、表示側だけでURLらしき部分をaタグに置き換える。
export function Linkify({ text, className }: { text: string; className?: string }) {
  const parts = text.split(URL_PATTERN);

  return (
    <p className={cn("whitespace-pre-line", className)}>
      {parts.map((part, index) =>
        URL_TEST.test(part) ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline break-all hover:no-underline"
          >
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </p>
  );
}
