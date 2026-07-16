-- 広告はタイトル/説明文/掲載場所の入力欄を廃止し、画像とリンク先URLのみで
-- 完結する自己完結型のバナー広告として作成する運用に変更したため、titleを
-- 必須ではなくす。(掲載場所はDBのenum自体は変えず、常に'top_hero'を使う)
alter table public.advertisements alter column title drop not null;
