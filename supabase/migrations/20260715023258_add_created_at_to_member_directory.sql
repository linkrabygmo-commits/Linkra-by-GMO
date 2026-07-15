-- 管理画面の会員承認キューで登録日時順に並べられるよう、非機密情報である
-- created_at を member_directory ビューに追加する。

create or replace view public.member_directory as
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
    then looking_for else null end as looking_for,
  created_at
from public.profiles;

grant select on public.member_directory to anon, authenticated;
