import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 素のGETフォーム。JS不要で動作し、送信するとURLに?q=...が付いてページが
// 再読み込みされる。Server Component側はsearchParams.qを読んで絞り込む。
export function SearchForm({
  action,
  defaultValue,
  placeholder,
}: {
  action: string;
  defaultValue?: string;
  placeholder: string;
}) {
  return (
    <form action={action} className="flex w-full max-w-sm gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      <Button type="submit" variant="outline">
        検索
      </Button>
    </form>
  );
}
