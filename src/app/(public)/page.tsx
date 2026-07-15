import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Building2, Handshake, Sparkles } from "lucide-react";
import { listNewMembers } from "@/features/members/repository";
import { MemberCard } from "@/features/members/components/member-card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
  },
};

const FEATURES = [
  {
    icon: Building2,
    title: "企業とつながる",
    description:
      "クライアント企業・協力会社・グループ会社が集まるビジネスコミュニティです。",
  },
  {
    icon: Handshake,
    title: "信頼できる会員ネットワーク",
    description: "運営の承認を経た会員同士だから、安心してつながれます。",
  },
  {
    icon: Sparkles,
    title: "新しいビジネスチャンス",
    description: "紹介・相談を通じて、新しいビジネスの機会が生まれます。",
  },
];

export default function TopPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-6 px-6 py-32 text-center">
        <p className="text-sm font-medium tracking-wide text-muted-foreground">
          {siteConfig.name}
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {siteConfig.description}
        </h1>
        <p className="max-w-md text-base leading-7 text-muted-foreground">
          クライアント企業・協力会社・グループ会社が集まるビジネスコミュニティ。
        </p>
        <div className="flex gap-3 pt-2">
          <Button size="lg" asChild>
            <Link href="/signup">会員登録</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">ログイン</Link>
          </Button>
        </div>
      </section>

      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center gap-3 text-center">
              <feature.icon className="size-8 text-primary" />
              <h2 className="text-base font-medium text-foreground">
                {feature.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              新着メンバー
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/members">会員ディレクトリを見る</Link>
            </Button>
          </div>
          <Suspense fallback={<p className="text-muted-foreground">読み込み中...</p>}>
            <NewMembers />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

async function NewMembers() {
  const members = await listNewMembers(6);

  if (members.length === 0) {
    return <p className="text-muted-foreground">まだ会員がいません。</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}
