-- 3. イベント参加申込に回答期限(任意)を設定できるようにする。
alter table public.events
  add column if not exists application_deadline timestamptz;

-- 4. ゲスト申込フォームに「会社名」「役職」を追加する。
-- 既存データはNULL(未入力)のまま許容し、表示・CSV出力側で空欄として扱う。
alter table public.guest_event_applications
  add column if not exists company_name text,
  add column if not exists title text;
