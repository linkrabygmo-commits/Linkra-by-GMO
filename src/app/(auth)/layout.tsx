import { LinkraLogo } from "@/components/brand/linkra-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-muted/40 px-6 py-16">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <LinkraLogo size="lg" tone="dark" />
        </div>
        {children}
      </div>
    </div>
  );
}
