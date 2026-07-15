import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getMemberById } from "@/features/members/repository";
import { MaskedField } from "@/features/members/components/masked-field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  return (
    <div className="flex flex-1 flex-col px-6 py-10">
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <MemberDetailContent paramsPromise={params} />
      </Suspense>
    </div>
  );
}

async function MemberDetailContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ memberId: string }>;
}) {
  const { memberId } = await paramsPromise;
  const member = await getMemberById(memberId);

  if (!member) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="flex items-center gap-4">
        <Avatar size="lg" className="size-16">
          <AvatarImage src={member.avatarUrl ?? undefined} alt="" />
          <AvatarFallback>{member.displayName.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {member.displayName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {member.companyName ?? "会社名未設定"}
            {member.title ? ` / ${member.title}` : ""}
          </p>
          {member.industry && (
            <p className="text-sm text-muted-foreground">{member.industry}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <MaskedField
          label="自己紹介"
          value={member.bio}
          canView={member.canViewFull}
        />
        <MaskedField
          label="紹介できること"
          value={member.canOffer}
          canView={member.canViewFull}
        />
        <MaskedField
          label="探していること"
          value={member.lookingFor}
          canView={member.canViewFull}
        />
        <MaskedField
          label="電話番号"
          value={member.phone}
          canView={member.canViewFull}
        />
        <MaskedField
          label="住所"
          value={member.address}
          canView={member.canViewFull}
        />
        <MaskedField
          label="X (Twitter)"
          value={member.twitterUrl}
          canView={member.canViewFull}
        />
        <MaskedField
          label="Facebook"
          value={member.facebookUrl}
          canView={member.canViewFull}
        />
        <MaskedField
          label="LinkedIn"
          value={member.linkedinUrl}
          canView={member.canViewFull}
        />
      </div>
    </div>
  );
}
