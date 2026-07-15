export const siteConfig = {
  name: "Linkra by GMO",
  description: "人と企業をつなぎ、新しいビジネスの時代を創る。",
  // 独自ドメイン確定後に更新する
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
