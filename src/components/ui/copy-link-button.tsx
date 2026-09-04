"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyLinkButtonProps {
  /** コピーするURLのパス部分(例: "/signup")。実行時のoriginと組み合わせて絶対URLにする。 */
  path: string;
  label?: string;
}

// 会員登録は招待制ではなく公開フォーム(/signup)経由のみのため、実際に招待メールを
// 送る仕組みは持たず、会員管理画面から公開登録URLをすぐ共有できるようにするだけの補助ボタン。
export function CopyLinkButton({ path, label = "招待リンクをコピー" }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const url = `${window.location.origin}${path}`;

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("以下のURLをコピーしてください", url);
      return;
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button type="button" size="sm" className="w-fit" onClick={handleClick}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "コピーしました" : label}
    </Button>
  );
}
