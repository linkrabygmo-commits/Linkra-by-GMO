-- 一度キャンセルした会員向けイベント申込を、再度申し込めるようにする。
-- 従来は (event_id, user_id) の完全unique制約があり、キャンセル後も行が残るため
-- 再申込のinsertがunique_violationで弾かれていた。
--
-- 「同時にアクティブ(pending/confirmed)な申込は1人1件まで」というルール自体は維持しつつ、
-- キャンセル済みの履歴は複数残せるように、完全unique制約を
-- 「status <> 'cancelled' の行に限定したpartial unique index」に置き換える。

-- 実DBに接続してconstraint名を確認できない環境で書いているため、決め打ちの名前で
-- dropするのではなく、(event_id, user_id)に対する完全unique制約をpg_constraintから
-- 動的に探して落とす(名前がPostgresのデフォルト命名と異なっていても安全に動く)。
do $$
declare
  target_constraint text;
begin
  select conname into target_constraint
  from pg_constraint
  where conrelid = 'public.member_event_applications'::regclass
    and contype = 'u'
    and conkey = (
      select array_agg(attnum order by attnum)
      from pg_attribute
      where attrelid = 'public.member_event_applications'::regclass
        and attname in ('event_id', 'user_id')
    );

  if target_constraint is not null then
    execute format(
      'alter table public.member_event_applications drop constraint %I',
      target_constraint
    );
  end if;
end $$;

create unique index if not exists member_event_applications_active_unique
  on public.member_event_applications (event_id, user_id)
  where status <> 'cancelled';
