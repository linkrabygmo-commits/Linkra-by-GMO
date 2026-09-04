-- イベント参加申込の「審査中→管理画面で確定」という運用をやめ、申込時点で即確定扱いにする。
-- 申込者からは「済(=申込あり)」「未(=申込なし/キャンセル済み)」の2状態だけが見えればよく、
-- 管理者が個々の申込を手動で確定する作業は不要になる。
--
-- 既存の'pending'行は、上記の変更後は確定にする手段がなくなるため、ここで一括して
-- 'confirmed'に繰り上げておく(キャンセル済みの履歴はそのまま残す)。
update public.member_event_applications
set status = 'confirmed'
where status = 'pending';

update public.guest_event_applications
set status = 'confirmed'
where status = 'pending';
