-- 広告機能: 会員による掲載申請 → admin承認 → 期間内は公開表示

create type public.ad_placement as enum ('top_hero', 'sidebar', 'inline');
-- 'active'/'expired' は保持しない。承認済み(approved)であることと、
-- starts_at/ends_at の期間内であることをクエリ時に判定して表示するため、
-- スケジューラ(cron等)なしで期限管理が完結する。
create type public.ad_status as enum ('pending', 'approved', 'rejected');

create table public.advertisements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  video_url text,
  link_url text not null,
  placement public.ad_placement not null default 'top_hero',
  status public.ad_status not null default 'pending',
  requested_by uuid not null references public.profiles (id),
  approved_by uuid references public.profiles (id),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.advertisements enable row level security;

create trigger set_advertisements_updated_at
before update on public.advertisements
for each row execute function public.set_updated_at();

-- SELECT: 承認済みで期間内のものは誰でも閲覧可(トップページ等での表示用)。
-- 加えて、申請者本人は自分の申請(pending/rejectedも含む)を、adminは全件を閲覧できる。
create policy "Anyone can view approved ads within date range"
on public.advertisements for select
to anon, authenticated
using (
  status = 'approved'
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

create policy "Requesters can view their own ad requests"
on public.advertisements for select
to authenticated
using (requested_by = auth.uid());

create policy "Admins can view all ad requests"
on public.advertisements for select
to authenticated
using (public.current_member_status() = 'admin');

-- INSERT: approved/admin会員のみ申請可能。
create policy "Approved members can request ads"
on public.advertisements for insert
to authenticated
with check (
  public.current_member_status() in ('approved', 'admin')
  and requested_by = auth.uid()
);

-- UPDATE: 申請者は承認前(pending)の自分の申請のみ編集可。adminは全件を承認/却下・編集可。
create policy "Requesters can edit their own pending request"
on public.advertisements for update
to authenticated
using (requested_by = auth.uid() and status = 'pending')
with check (requested_by = auth.uid() and status = 'pending');

create policy "Admins can manage all ad requests"
on public.advertisements for update
to authenticated
using (public.current_member_status() = 'admin')
with check (public.current_member_status() = 'admin');

-- 既存admin宛にデモ広告を承認済みで種まきしておく(トップページのカルーセルが
-- 空にならないようにするための初期データ。管理画面からいつでも編集/削除可能)。
insert into public.advertisements (title, description, link_url, placement, status, requested_by, approved_by)
select
  banner.title,
  banner.description,
  '#',
  'top_hero',
  'approved',
  admin_profile.id,
  admin_profile.id
from (
  values
    ('GMOグループの最新サービス', 'GMOインターネットグループの多彩なサービスをご紹介します。'),
    ('会員限定キャンペーン実施中', '今だけの特別オファーをぜひチェックしてください。'),
    ('会員限定イベント開催中', 'ビジネスの輪が広がるイベントを随時開催しています。'),
    ('Linkra by GMO からのお知らせ', '最新のお知らせ・アップデート情報をお届けします。')
) as banner(title, description)
cross join (
  select id from public.profiles where member_status = 'admin' limit 1
) as admin_profile;
