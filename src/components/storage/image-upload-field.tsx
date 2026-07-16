"use client";

import { useState, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { UPLOAD_BUCKET } from "@/lib/storage/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UploadScope = "avatars" | "ads" | "events" | "announcements" | "companies";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  scope: UploadScope;
  defaultValue?: string | null;
}

export function ImageUploadField({ name, label, scope, defaultValue }: ImageUploadFieldProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        body: JSON.stringify({ scope, contentType: file.type, fileExtension }),
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
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <input type="hidden" name={name} value={value} />
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="size-24 rounded-lg border border-border object-cover"
        />
      )}
      <Input
        id={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p className="text-sm text-muted-foreground">アップロード中...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
