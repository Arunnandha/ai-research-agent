export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-zinc-100 bg-white p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="h-8 w-8 rounded-lg bg-zinc-200" />
        <div className="h-4 w-24 rounded bg-zinc-200" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-zinc-100" />
        <div className="h-3 w-4/5 rounded bg-zinc-100" />
        <div className="h-3 w-3/5 rounded bg-zinc-100" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="animate-pulse rounded-xl border border-zinc-100 bg-white px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="h-4 w-40 rounded bg-zinc-200" />
        <div className="h-4 w-12 rounded bg-zinc-100" />
      </div>
      <div className="mt-2 h-3 w-3/4 rounded bg-zinc-100" />
      <div className="mt-2.5 flex gap-1.5">
        <div className="h-5 w-16 rounded-full bg-zinc-100" />
        <div className="h-5 w-16 rounded-full bg-zinc-100" />
        <div className="h-5 w-16 rounded-full bg-zinc-100" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="space-y-3">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  );
}
