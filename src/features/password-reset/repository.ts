import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";

export type RequestPasswordResetResult =
  | { status: "not_found" }
  | { status: "pending" }
  | { status: "ready"; requestId: string };

// メールアドレスからユーザーを探し、申請の現在状況を返す。申請が無ければ
// 新規にpendingの申請を作る(=「パスワードを忘れた方」を押した瞬間の動作と、
// 後で状況確認のために同じ画面へ戻ってきた時の動作を1つの関数にまとめている)。
// 対象者は未ログインのため、ここから先はすべてservice role(admin client)で行う。
export async function requestOrCheckPasswordReset(
  email: string,
): Promise<RequestPasswordResetResult> {
  const adminClient = createAdminClient();

  const { data: userId, error: lookupError } = await adminClient.rpc(
    "find_user_id_by_email",
    { lookup_email: email },
  );

  if (lookupError) throw new Error(lookupError.message);
  if (!userId) return { status: "not_found" };

  const { data: existing, error: existingError } = await adminClient
    .from("password_reset_requests")
    .select("id, status")
    .eq("user_id", userId)
    .order("requested_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) throw new Error(existingError.message);

  if (existing?.status === "approved") {
    return { status: "ready", requestId: existing.id };
  }
  if (existing?.status === "pending") {
    return { status: "pending" };
  }

  // 申請が無い、またはこれまでの申請が完了済み(completed)の場合は新規に作る。
  const { error: insertError } = await adminClient
    .from("password_reset_requests")
    .insert({ user_id: userId });

  if (insertError) throw new Error(insertError.message);

  return { status: "pending" };
}

// 承認済み(approved)の申請1件に対して新しいパスワードを設定し、completedにする。
// requestIdはUUIDでランダム性があるとはいえ、他人の申請を勝手に完了させられない
// よう、statusが'approved'であることを必ず確認してから実行する。
export async function completePasswordReset(
  requestId: string,
  newPassword: string,
): Promise<void> {
  const adminClient = createAdminClient();

  const { data: request, error: requestError } = await adminClient
    .from("password_reset_requests")
    .select("id, user_id, status")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) throw new Error(requestError.message);
  if (!request || request.status !== "approved") {
    throw new Error(
      "この申請はまだ承認されていないか、既に処理済みです。お手数ですがもう一度メールアドレスを入力して状況をご確認ください。",
    );
  }

  const { error: updateUserError } = await adminClient.auth.admin.updateUserById(
    request.user_id,
    { password: newPassword },
  );

  if (updateUserError) throw new Error(updateUserError.message);

  const { error: completeError } = await adminClient
    .from("password_reset_requests")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", requestId);

  if (completeError) throw new Error(completeError.message);
}

export interface PasswordResetRequestDto {
  id: string;
  displayName: string;
  requestedAt: string;
}

// 管理画面で承認待ちの申請一覧を表示するため。管理者の通常セッションで
// 呼ばれる(RLSの"Admins can view password reset requests"ポリシーに依存)。
export async function listPendingPasswordResetRequests(): Promise<
  PasswordResetRequestDto[]
> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("password_reset_requests")
    .select("id, user_id, requested_at")
    .eq("status", "pending")
    .order("requested_at", { ascending: true });

  if (error) throw new Error(error.message);
  if (!requests || requests.length === 0) return [];

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in(
      "id",
      requests.map((request) => request.user_id),
    );

  if (profilesError) throw new Error(profilesError.message);

  const nameById = new Map((profiles ?? []).map((profile) => [profile.id, profile.display_name]));

  return requests.map((request) => ({
    id: request.id,
    displayName: nameById.get(request.user_id) ?? "(不明な会員)",
    requestedAt: request.requested_at,
  }));
}

// 承認操作自体は管理者の通常セッションで行える(RLSのupdateポリシーに従う)。
export async function approvePasswordResetRequest(requestId: string): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("password_reset_requests")
    .update({ status: "approved", approved_at: new Date().toISOString(), approved_by: admin.id })
    .eq("id", requestId)
    .eq("status", "pending");

  if (error) throw new Error(error.message);
}
