-- パスワードを忘れた場合の再設定を、メール送信ではなく管理者承認制にする。
-- 対象者はメールアドレスを入力して申請 → 管理者が管理画面で承認 → 対象者が
-- 同じ画面に戻って新しいパスワードを設定する、という流れ。メール送信の
-- 仕組み(Resend等)は引き続き一切使わない。承認された申請から新しいパスワード
-- を設定する処理はservice roleで行うため、対象者側の操作はすべて未ログイン
-- のまま完結する。

create type public.password_reset_status as enum ('pending', 'approved', 'completed');

create table public.password_reset_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.password_reset_status not null default 'pending',
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references public.profiles (id),
  completed_at timestamptz
);

alter table public.password_reset_requests enable row level security;

-- 申請の作成・承認状況の確認・パスワードの確定は、すべてService Roleを使う
-- サーバーアクション経由でのみ行う(申請者は未ログインのため、通常の認証済み
-- クライアントでは行えない)。管理画面からの閲覧・承認だけ、管理者の通常
-- セッションで行えるようポリシーを用意する。
create policy "Admins can view password reset requests"
on public.password_reset_requests for select
to authenticated
using (public.current_member_status() = 'admin');

create policy "Admins can update password reset requests"
on public.password_reset_requests for update
to authenticated
using (public.current_member_status() = 'admin')
with check (public.current_member_status() = 'admin');

-- メールアドレスからユーザーIDを引くための関数。auth.usersはpublicスキーマの
-- 通常クライアントから直接参照できないため、security definer経由で限定的に
-- 公開する(email列挙を避けるためservice_roleのみ実行可能にする)。
create or replace function public.find_user_id_by_email(lookup_email text)
returns uuid
language sql
security definer
set search_path = ''
stable
as $$
  select id from auth.users where lower(email) = lower(lookup_email) limit 1;
$$;

revoke all on function public.find_user_id_by_email(text) from public;
grant execute on function public.find_user_id_by_email(text) to service_role;
