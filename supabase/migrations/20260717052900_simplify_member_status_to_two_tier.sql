-- 会員ステータスを「登録済み(承認待ち)→承認済み→管理者」の3段階から、
-- 「一般会員(='approved')/管理者」の実質2段階に簡素化する。
-- enum自体はDBの型変更(recreate)が必要になり既存データへの影響が大きいため、
-- 'registered'という値そのものは残しつつ、以後は使わないようにする:
--   - 新規登録時のデフォルトをapprovedにし、登録直後からフル機能を使える様にする
--   - 既存のregisteredユーザーをapprovedに引き上げる(承認待ちのまま止まっている人を救済)
alter table public.profiles alter column member_status set default 'approved';

update public.profiles set member_status = 'approved' where member_status = 'registered';
