-- 広告は「会員が申請→管理者が承認」ではなく「管理者が直接作成・編集・削除」する
-- 方式に変更したため、管理者による削除を許可するポリシーを追加する。
-- (作成時のmigrationにはselect/insert/updateのみで、deleteポリシーが漏れていた)
create policy "Admins can delete ads"
on public.advertisements for delete
to authenticated
using (public.current_member_status() = 'admin');
