"use client";

import { useState, useTransition } from "react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmSubmitButtonProps extends Omit<
  ComponentProps<typeof Button>,
  "onClick"
> {
  confirmMessage: string;
  // 呼び出し側で `deleteXAction.bind(null, id)` のように引数を束縛した、
  // 直接呼び出し可能なserver actionを渡す。<form>でラップする必要はない。
  action: () => Promise<void> | void;
}

// 削除など取り消せない操作の確認をモーダルで行う。
//
// 実行時はaction()を直接呼び出した後、location.reload()で確実に最新状態を反映する。
// このアプリはNext.js 16のCache Components(cacheComponents: true)を有効化しており、
// 一覧系のrepository関数はどれも"use cache"を使わない素の動的フェッチのため、
// revalidatePath()だけでは「今開いている画面」がその場で更新されない
// (別ルートへ実際に遷移した場合は最新データが反映されるため、キャッシュ自体は
// 正しく無効化されている。router.refresh()や<form>のtype="submit"による通常の
// アクション呼び出しでも、このCache Components環境下では現在ルートの再描画が
// 反映されないことをPlaywrightで確認済み)。確実性を優先し、確認モーダルを経る
// 破壊的操作に限ってページ全体をリロードする。
export function ConfirmSubmitButton({
  confirmMessage,
  action,
  children,
  disabled,
  ...props
}: ConfirmSubmitButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await action();
      window.location.reload();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        {...props}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>確認</DialogTitle>
          <DialogDescription>{confirmMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              キャンセル
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? "実行中..." : "実行する"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
