import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// 検索欄共通ラッパー。既存のInputに左側の虫眼鏡アイコンを重ねるだけの薄いコンポーネント。
export function SearchInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className={cn("h-10 rounded-lg pl-9", className)} {...props} />
    </div>
  );
}
