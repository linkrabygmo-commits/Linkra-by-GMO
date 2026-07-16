-- 管理者ページでの会員ステータス変更(registered/approved/adminを自由に設定)用。
-- approve_member()と同じ「ナローな関数でmember_statusのみを更新する」パターンを踏襲する。
create function public.set_member_status(target_id uuid, new_status public.member_status)
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
  set member_status = new_status
  where id = target_id
  returning * into result;

  return result;
end;
$$;
