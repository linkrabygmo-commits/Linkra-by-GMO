"use client";

import { useTransition } from "react";
import { updateMemberStatusAction } from "@/features/admin/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MemberStatus } from "@/types/database";

const LABELS = {
  admin: "管理者",
  approved: "一般会員",
} as const;

interface MemberStatusSelectProps {
  memberId: string;
  currentStatus: MemberStatus;
  disabled?: boolean;
}

// 会員ステータスは管理者/一般会員の2択に簡素化。'registered'(旧・承認待ち)の
// データが残っていても、一般会員として扱って表示する。
export function MemberStatusSelect({
  memberId,
  currentStatus,
  disabled,
}: MemberStatusSelectProps) {
  const [isPending, startTransition] = useTransition();
  const value = currentStatus === "admin" ? "admin" : "approved";

  function handleChange(next: string) {
    startTransition(() => {
      updateMemberStatusAction(memberId, next as MemberStatus);
    });
  }

  return (
    <Select value={value} onValueChange={handleChange} disabled={disabled || isPending}>
      <SelectTrigger size="sm" className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">{LABELS.admin}</SelectItem>
        <SelectItem value="approved">{LABELS.approved}</SelectItem>
      </SelectContent>
    </Select>
  );
}
