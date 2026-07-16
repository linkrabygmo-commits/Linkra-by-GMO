-- プロフィール画像・広告画像・イベント/お知らせのカバー画像用の公開バケット。
-- アップロードは常に service_role が発行した署名付きアップロードURL経由のみで行われる
-- (認可判定は app/api/storage/upload-url ルートハンドラ側で行うため、
-- バケット自体はpublicにして誰でも閲覧できるようにするだけでよい)。
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;
