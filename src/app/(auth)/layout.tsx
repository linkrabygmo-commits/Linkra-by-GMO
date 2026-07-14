import { siteConfig } from "@/config/site";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-muted/40 px-6 py-16">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
        <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
          {siteConfig.name}
        </p>
        {children}
      </div>
    </div>
  );
}
