'use client';

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 animate-skeleton">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-[var(--hover-bg)]" />
        <div className="h-3 w-24 rounded bg-[var(--hover-bg)]" />
      </div>
      <div className="h-7 w-20 rounded bg-[var(--hover-bg)] mb-3" />
      <div className="h-1.5 w-full rounded-full bg-[var(--hover-bg)]" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 animate-skeleton">
      <div className="h-4 w-32 rounded bg-[var(--hover-bg)] mb-4" />
      <div className="h-56 rounded-lg bg-[var(--hover-bg)]" />
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="h-7 w-48 rounded bg-[var(--hover-bg)] mb-2" />
        <div className="h-4 w-64 rounded bg-[var(--hover-bg)]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>
    </div>
  );
}
