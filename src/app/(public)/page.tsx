import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Building2, Handshake, Sparkles } from "lucide-react";
import { listNewMembers } from "@/features/members/repository";
import { MemberCard } from "@/features/members/components/member-card";
import { listActiveHeroBanners } from "@/features/ads/data";
import { HeroBannerCarousel } from "@/features/ads/components/hero-banner-carousel";
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
    title: "つながりが、ビジネスを加速する",
    description:
      "クライアント企業・協力会社・グループ会社との\n新しい出会いが、価値を生み出します。",
  },
  {
    icon: Handshake,
    title: "信頼でつながる、安心のネットワーク",
    description:
      "運営の透明性と信頼性を大切にし、\n安心してつながれるコミュニティを提供します。",
  },
  {
    icon: Sparkles,
    title: "新しいビジネスの時代へ",
    description: "紹介・相談・共創を通じて、\n未来のビジネスチャンスが広がります。",
  },
];

export default async function TopPage() {
  const banners = await listActiveHeroBanners();

  return (
    <div className="flex flex-1 flex-col">
      <div className="hero-warp">
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 pt-20 pb-20 sm:pt-28 sm:pb-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
            <div className="flex max-w-2xl flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                  Linkra <span className="font-light text-white/50">by</span>{" "}
                  <span className="font-extrabold tracking-tight">GMO</span>
                </h1>
                <p className="text-sm text-white/45">
                  Link（つながり）＋ Era（時代）＝ Linkra（リンクラ）
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <span className="h-1 w-10 rounded-full bg-blue-500" />
                <h2 className="text-3xl leading-snug font-bold text-white sm:text-4xl">
                  人と企業をつなぎ、
                  <br />
                  新しいビジネスの時代を創る。
                </h2>
                <p className="text-base text-white/60">
                  Linkraは&ldquo;新しいつながりが生まれる場所&rdquo;を目指します。
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-medium text-white shadow-[0_0_30px_-6px_rgba(59,130,246,0.8)] transition-transform hover:scale-[1.02]"
                >
                  会員登録する
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/50"
                >
                  ログイン
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <HeroBannerCarousel banners={banners} />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 sm:divide-x sm:divide-white/10">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-3 sm:px-8 sm:first:pl-0">
                <feature.icon className="size-6 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.7)]" />
                <h3 className="text-base font-medium text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-line text-white/60">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
