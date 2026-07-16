import { NextResponse } from "next/server";
import { getCurrentUser, getMyMemberStatus } from "@/lib/auth/session";
import { createUploadUrl, getPublicUrl } from "@/lib/storage/supabase-storage";

const ALLOWED_SCOPES = ["avatars", "ads", "events", "announcements"] as const;
type UploadScope = (typeof ALLOWED_SCOPES)[number];

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

interface UploadUrlRequestBody {
  scope?: string;
  contentType?: string;
  fileExtension?: string;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as UploadUrlRequestBody | null;
  const scope = body?.scope;
  const contentType = body?.contentType;
  const fileExtension = body?.fileExtension?.toLowerCase();

  if (
    !scope ||
    !ALLOWED_SCOPES.includes(scope as UploadScope) ||
    !contentType ||
    !ALLOWED_CONTENT_TYPES.includes(contentType) ||
    !fileExtension ||
    !ALLOWED_EXTENSIONS.includes(fileExtension)
  ) {
    return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
  }

  if (scope === "ads" || scope === "events" || scope === "announcements") {
    const memberStatus = await getMyMemberStatus();
    const requiredStatuses = scope === "ads" ? ["approved", "admin"] : ["admin"];

    if (!memberStatus || !requiredStatuses.includes(memberStatus)) {
      return NextResponse.json({ error: "この操作を行う権限がありません。" }, { status: 403 });
    }
  }

  const path = `${scope}/${user.id}/${crypto.randomUUID()}.${fileExtension}`;
  const { signedUrl, token } = await createUploadUrl(path);
  const publicUrl = getPublicUrl(path);

  return NextResponse.json({ signedUrl, token, path, publicUrl });
}
