-- 会員ステータス基盤 + プロフィール拡張項目 + マスキング済み公開ビュー

create type public.member_status as enum ('registered', 'approved', 'admin');
-- 'guest' は未ログイン状態を表すだけなので値としては持たない。
-- 'premium' は承認パイプラインと直交する属性のため、このenumには含めない
-- (将来的には別カラム/entitlementsテーブルとして持つ)。

alter table public.profiles
  add column member_status public.member_status not null default 'registered',
  add column phone text,
  add column address text,
  add column sns_links jsonb,
  add column bio text,
  add column can_offer text,
  add column looking_for text,
  add column industry text,
  add column company_name text;

-- 呼び出し元(auth.uid())自身のmember_statusを取得するヘルパー。
-- company_role_of()と同様、security definerでRLSの自己参照を避ける。
create function public.current_member_status()
returns public.member_status
language sql
security definer
set search_path = ''
stable
as $$
  select member_status from public.profiles where id = auth.uid();
$$;

-- 既存の "Authenticated users can view profiles" (using (true)) は列制限がなく、
-- ログインさえしていれば phone/address 等の機密カラムも直接REST APIで取得できて
-- しまうため廃止する。以後、他人のプロフィール参照は必ず member_directory 経由にする。
drop policy "Authenticated users can view profiles" on public.profiles;

create policy "Users can view their own full profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

-- マスキング済み公開ビュー。security_invoker は設定しない
-- (invoker権限にすると呼び出し元の権限で実行され、上記でSELECTを絞った
-- profiles本体を読めなくなり壊れる。owner権限で実行させる必要がある)。
create view public.member_directory as
select
  id,
  display_name,
  avatar_url,
  company_name,
  title,
  industry,
  member_status,
  case when id = auth.uid() or public.current_member_status() in ('approved', 'admin')
    then phone else null end as phone,
  case when id = auth.uid() or public.current_member_status() in ('approved', 'admin')
    then address else null end as address,
  case when id = auth.uid() or public.current_member_status() in ('approved', 'admin')
    then sns_links else null end as sns_links,
  case when id = auth.uid() or public.current_member_status() in ('approved', 'admin')
    then bio else null end as bio,
  case when id = auth.uid() or public.current_member_status() in ('approved', 'admin')
    then can_offer else null end as can_offer,
  case when id = auth.uid() or public.current_member_status() in ('approved', 'admin')
    then looking_for else null end as looking_for
from public.profiles;

grant select on public.member_directory to anon, authenticated;

-- 会員承認: admin以外は実行できない。member_statusのみを更新するナローな関数にすることで、
-- 「adminなら他人のprofilesを何でも書き換えられる」広いUPDATEポリシーを避ける。
create function public.approve_member(target_id uuid)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_status public.member_status;
  result public.profiles;
begin
  select member_status into caller_status from public.profiles where id = auth.uid();

  if caller_status <> 'admin' then
    raise exception '権限がありません';
  end if;

  update public.profiles
  set member_status = 'approved'
  where id = target_id
  returning * into result;

  return result;
end;
$$;
