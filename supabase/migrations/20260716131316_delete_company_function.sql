-- 会社の削除は管理画面から管理者のみ行える。company_membersはcompaniesへの
-- on delete cascadeで自動的に削除されるが、そのcascade削除はcompany_membersの
-- DELETEポリシー(本人 or その会社のowner/adminのみ)の対象にもなってしまい、
-- 削除対象の会社に所属していないメンバーの行がRLSに弾かれてトランザクション
-- 全体が失敗しうる。approve_member()等と同じくsecurity definer関数にして
-- RLSを経由せずに削除することで、これを避ける。
create function public.delete_company(target_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.current_member_status() <> 'admin' then
    raise exception '管理者のみ会社を削除できます。';
  end if;

  delete from public.companies where id = target_id;
end;
$$;
