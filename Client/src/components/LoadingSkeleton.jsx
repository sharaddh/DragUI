export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="h-8 w-8 rounded-lg bg-slate-200" />
      </div>
      <div className="mt-3 h-8 w-16 rounded bg-slate-200" />
      <div className="mt-2 h-1 w-full rounded-full bg-slate-100" />
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-xl bg-slate-200" />
        <div className="flex gap-1">
          <div className="h-8 w-8 rounded-lg bg-slate-200" />
          <div className="h-8 w-8 rounded-lg bg-slate-200" />
        </div>
      </div>
      <div className="mt-4 h-5 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-full rounded bg-slate-200" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 w-16 rounded bg-slate-200" />
        <div className="h-5 w-20 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3.5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-slate-200" />
        <div>
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="mt-1 h-3 w-24 rounded bg-slate-200" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-5 w-16 rounded-full bg-slate-200" />
        <div className="h-4 w-10 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-3xl space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-40 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-60 rounded bg-slate-200" />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-slate-200" />
          <div>
            <div className="h-5 w-48 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-24 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
