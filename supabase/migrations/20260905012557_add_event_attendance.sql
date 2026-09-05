-- イベント当日の実際の参加(チェックイン)を「申込」とは別に記録できるようにする。
-- 申込ステータス(status)は「申込がキャンセルされていないか」を表すもので、
-- 実際に会場へ来たかどうかとは独立した情報のため、別カラムとして持たせる。
alter table public.member_event_applications
  add column if not exists attended boolean not null default false;

alter table public.guest_event_applications
  add column if not exists attended boolean not null default false;
