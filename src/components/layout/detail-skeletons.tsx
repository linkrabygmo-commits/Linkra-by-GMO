import { Skeleton } from "@/components/ui/skeleton";

/** A breadcrumb-shaped placeholder, matching <Breadcrumb> at a glance while data loads. */
function BreadcrumbSkeleton({ segments = 2 }: { segments?: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: segments }).map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-muted-foreground">/</span>}
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

/** Generic skeleton for a <form> page (create/edit): label+input rows plus a submit button. */
export function FormSkeleton({
  breadcrumbSegments,
  fields = 4,
}: {
  breadcrumbSegments?: number;
  fields?: number;
}) {
  return (
    <>
      {breadcrumbSegments && <BreadcrumbSkeleton segments={breadcrumbSegments} />}
      <Skeleton className="h-8 w-40" />
      <div className="flex max-w-md flex-col gap-4">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
        <Skeleton className="h-9 w-24" />
      </div>
    </>
  );
}

/** Skeleton for the member detail page (avatar + name header, then a card of masked fields). */
export function MemberDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <BreadcrumbSkeleton />
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 shrink-0 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton for the company detail page (logo + name header, description, member list). */
export function CompanyDetailSkeleton() {
  return (
    <>
      <BreadcrumbSkeleton />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 shrink-0 rounded-lg" />
          <Skeleton className="h-7 w-48" />
        </div>
        <Skeleton className="h-7 w-20" />
      </div>
      <Skeleton className="h-4 w-2/3" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-32" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </>
  );
}

/** Skeleton for the event detail page (cover image, title/badge, meta lines, application card). */
export function EventDetailSkeleton() {
  return (
    <>
      <BreadcrumbSkeleton />
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
    </>
  );
}

/** Skeleton for the announcement detail page (title/date, cover image, body paragraph). */
export function AnnouncementDetailSkeleton() {
  return (
    <>
      <BreadcrumbSkeleton />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </>
  );
}

/** Skeleton for the admin event-applications page (heading + a few applicant rows). */
export function ApplicationsListSkeleton() {
  return (
    <>
      <BreadcrumbSkeleton />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </>
  );
}
