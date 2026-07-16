-- イベント機能: 公開/会員限定イベントの告知と、会員/ゲストそれぞれの申込

create type public.event_audience as enum ('member_only', 'public');
create type public.event_application_status as enum ('pending', 'confirmed', 'cancelled');

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_image_url text,
  audience public.event_audience not null default 'public',
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  capacity integer,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ログイン済み会員の申込。1イベントにつき1人1件まで。
create table public.member_event_applications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.event_application_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- 未ログインでも申込可能な public イベント向けのゲスト申込。
-- 氏名・連絡先を直接保持するためadmin以外には見せない(guest_event_applicationsのRLS参照)。
create table public.guest_event_applications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  status public.event_application_status not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;
alter table public.member_event_applications enable row level security;
alter table public.guest_event_applications enable row level security;

create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

-- events: member_only も一覧上は存在が見える(鍵アイコン表示用)。申込可否はアプリ側で制御。
create policy "Anyone can view events"
on public.events for select
to anon, authenticated
using (true);

create policy "Admins can manage events"
on public.events for all
to authenticated
using (public.current_member_status() = 'admin')
with check (public.current_member_status() = 'admin');

-- member_event_applications: 本人+adminのみ閲覧、本人のみ申込・自分の申込のキャンセルが可能
create policy "Members can view their own applications"
on public.member_event_applications for select
to authenticated
using (user_id = auth.uid());

create policy "Admins can view all member applications"
on public.member_event_applications for select
to authenticated
using (public.current_member_status() = 'admin');

create policy "Members can apply to events"
on public.member_event_applications for insert
to authenticated
with check (user_id = auth.uid());

create policy "Members can update their own application"
on public.member_event_applications for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Admins can manage member applications"
on public.member_event_applications for update
to authenticated
using (public.current_member_status() = 'admin')
with check (public.current_member_status() = 'admin');

-- guest_event_applications: ゲストの個人情報保護のためadminのみ閲覧。誰でも申込(insert)は可能。
create policy "Admins can view guest applications"
on public.guest_event_applications for select
to authenticated
using (public.current_member_status() = 'admin');

create policy "Anyone can submit a guest application"
on public.guest_event_applications for insert
to anon, authenticated
with check (true);

create policy "Admins can manage guest applications"
on public.guest_event_applications for update
to authenticated
using (public.current_member_status() = 'admin')
with check (public.current_member_status() = 'admin');
