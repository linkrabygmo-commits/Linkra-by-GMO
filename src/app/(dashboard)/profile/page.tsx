import { Suspense } from "react";
import type { Metadata } from "next";
import { getMyProfile } from "@/features/profile/repository";
import { ProfileForm } from "@/features/profile/components/profile-form";

export const metadata: Metadata = {
  title: "プロフィール",
};

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold text-foreground">プロフィール</h1>
      <div className="max-w-md">
        <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
          <ProfileFormContent />
        </Suspense>
      </div>
    </div>
  );
}

async function ProfileFormContent() {
  const profile = await getMyProfile();
  return <ProfileForm profile={profile} />;
}
