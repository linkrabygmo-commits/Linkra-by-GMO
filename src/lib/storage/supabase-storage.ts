import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { UPLOAD_BUCKET } from "@/lib/storage/constants";

export async function createUploadUrl(
  path: string,
): Promise<{ signedUrl: string; token: string; path: string }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from(UPLOAD_BUCKET).createSignedUploadUrl(path);

  if (error || !data) {
    throw new Error(error?.message ?? "アップロードURLの発行に失敗しました。");
  }

  return { signedUrl: data.signedUrl, token: data.token, path: data.path };
}

export function getPublicUrl(path: string): string {
  const supabase = createAdminClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(UPLOAD_BUCKET).getPublicUrl(path);

  return publicUrl;
}
