-- 会員登録直後の初回ログイン後に、プロフィール設定画面へ一度だけ誘導するための
-- フラグ。新規登録はデフォルトfalseで作成され、プロフィールを保存した時点でtrueに
-- なる。既存ユーザーはすでにオンボード済みとみなし、一括でtrueにしておく。
alter table public.profiles
  add column if not exists onboarded boolean not null default false;

update public.profiles set onboarded = true where onboarded = false;
