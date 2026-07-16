"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "概要" },
  { href: "/admin/members", label: "会員管理" },
  { href: "/admin/ads", label: "広告設定" },
  { href: "/admin/events", label: "イベント管理" },
  { href: "/admin/announcements", label: "お知らせ管理" },
  { href: "/admin/companies", label: "企業管理" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {ADMIN_NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm transition-colors",
              isActive
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

// usePathname()に依存するAdminNav本体はSuspenseで包む必要があるため、
// そのフォールバック(アクティブ状態のハイライトなしの見た目)。
export function AdminNavSkeleton() {
  return (
    <nav className="flex items-center gap-1">
      {ADMIN_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
