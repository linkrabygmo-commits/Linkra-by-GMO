-- プロフィールの会社名を、companiesテーブルへの参照(company_id)で選べるようにする。
-- 従来の自由入力company_nameは既存データ保持のため残し、company_id未設定の
-- プロフィールに対するフォールバック表示として使う(coalesce)。
alter table public.profiles
  add column company_id uuid references public.companies (id) on delete set null;

create or replace view public.member_directory as
select
  p.id,
  p.display_name,
  p.avatar_url,
  coalesce(c.name, p.company_name) as company_name,
  p.company_id,
  p.title,
  p.industry,
  p.member_status,
  case when p.id = auth.uid() or public.current_member_status() in ('approved', 'admin')
    then p.phone else null end as phone,
  case when p.id = auth.uid() or public.current_member_status() in ('approved', 'admin')
    then p.address else null end as address,
  case when p.id = auth.uid() or public.current_member_status() in ('approved', 'admin')
    then p.sns_links else null end as sns_links,
  case when p.id = auth.uid() or public.current_member_status() in ('approved', 'admin')
    then p.bio else null end as bio,
  case when p.id = auth.uid() or public.current_member_status() in ('approved', 'admin')
    then p.can_offer else null end as can_offer,
  case when p.id = auth.uid() or public.current_member_status() in ('approved', 'admin')
    then p.looking_for else null end as looking_for,
  p.created_at
from public.profiles p
left join public.companies c on c.id = p.company_id;

grant select on public.member_directory to anon, authenticated;
