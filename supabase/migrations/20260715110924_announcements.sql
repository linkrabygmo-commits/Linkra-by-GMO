-- お知らせ機能: admin が作成し、公開(published)になったもののみ全員が閲覧可能

create type public.announcement_status as enum ('draft', 'published');

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  cover_image_url text,
  status public.announcement_status not null default 'draft',
  published_at timestamptz,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

create trigger set_announcements_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();

create policy "Anyone can view published announcements"
on public.announcements for select
to anon, authenticated
using (status = 'published');

create policy "Admins can manage announcements"
on public.announcements for all
to authenticated
using (public.current_member_status() = 'admin')
with check (public.current_member_status() = 'admin');
