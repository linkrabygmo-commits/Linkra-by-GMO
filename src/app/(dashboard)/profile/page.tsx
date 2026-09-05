import { Suspense } from "react";
import type { Metadata } from "next";
import { getMyProfile } from "@/features/profile/repository";
import { listCompanyOptions } from "@/features/companies/repository";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { FormSkeleton } from "@/components/layout/detail-skeletons";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "プロフィール",
};

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
      <PageHeader
        title="プロフィール"
        description="公開されるプロフィール情報を編集できます。"
      />
      <div className="max-w-md">
        <Suspense fallback={<FormSkeleton fields={6} />}>
          <ProfileFormContent />
        </Suspense>
      </div>
    </div>
  );
}

async function ProfileFormContent() {
  const [profile, companies] = await Promise.all([
    getMyProfile(),
    listCompanyOptions(),
  ]);
  return <ProfileForm profile={profile} companies={companies} />;
}
