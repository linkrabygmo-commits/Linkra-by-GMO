"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Camera, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UPLOAD_BUCKET } from "@/lib/storage/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadFieldProps {
  name: string;
  defaultValue?: string | null;
}

// LINEのプロフィール画面のような、円形アバターをタップしてそのまま画像を
// 選択できるUI。未設定時は人型のプレースホルダーアイコンを表示する。
// アップロード自体のロジックはImageUploadFieldと同じ(署名付きURL取得→
// uploadToSignedUrl)だが、見た目(タップ対象・カメラバッジ)が大きく異なるため
// 専用コンポーネントとして分けている。
export function AvatarUploadField({ name, defaultValue }: AvatarUploadFieldProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() ?? "";

      const urlRes = await fetch("/api/storage/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: "avatars", contentType: file.type, fileExtension }),
      });

      if (!urlRes.ok) {
        const body = await urlRes.json().catch(() => null);
        throw new Error(body?.error ?? "アップロードURLの取得に失敗しました。");
      }

      const { path, token, publicUrl } = (await urlRes.json()) as {
        path: string;
        token: string;
        publicUrl: string;
      };

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(UPLOAD_BUCKET)
        .uploadToSignedUrl(path, token, file);

      if (uploadError) {
        throw new Error("アップロードに失敗しました。");
      }

      setValue(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "アップロードに失敗しました。");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="プロフィール画像を変更"
      >
        <Avatar className="size-24">
          <AvatarImage src={value || undefined} alt="" />
          <AvatarFallback>
            <User className="size-10" />
          </AvatarFallback>
        </Avatar>
        <span className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-foreground text-background ring-2 ring-background">
          <Camera className="size-4" />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
      <input type="hidden" name={name} value={value} />

      <p className="text-xs text-muted-foreground">推奨サイズ: 400×400px、正方形</p>

      {uploading && <p className="text-xs text-muted-foreground">アップロード中...</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
