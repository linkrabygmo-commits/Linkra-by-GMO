import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default function MarketingHomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-32">
      <div className="flex max-w-xl flex-col items-center gap-6 text-center">
        <p className="text-sm font-medium tracking-wide text-muted-foreground">
          {siteConfig.name}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {siteConfig.description}
        </h1>
        <p className="max-w-md text-base leading-7 text-muted-foreground">
          クライアント企業・協力会社・グループ会社が集まるビジネスコミュニティ。
        </p>
        <div className="flex gap-3 pt-2">
          <Button size="lg" asChild>
            <a href="/login">ログイン</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/signup">新規登録</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
