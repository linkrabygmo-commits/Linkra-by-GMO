import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getInvitationPreview } from "@/features/companies/repository";
import { acceptInvitationAction } from "@/features/companies/actions";
import { Button } from "@/components/ui/button";

export default function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
        <InvitationContent paramsPromise={params} />
      </Suspense>
    </div>
  );
}

async function InvitationContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ token: string }>;
}) {
  const { token } = await paramsPromise;
  const invitation = await getInvitationPreview(token);

  if (!invitation) {
    notFound();
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center shadow-sm">
      <h1 className="text-xl font-semibold text-foreground">招待</h1>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {invitation.companyName}
        </span>{" "}
        から
        {invitation.role === "admin" ? "管理者" : "メンバー"}
        として招待されています。
      </p>
      <form action={acceptInvitationAction.bind(null, token)}>
        <Button type="submit">招待を承諾する</Button>
      </form>
    </div>
  );
}
