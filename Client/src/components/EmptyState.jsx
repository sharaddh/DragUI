import { Link } from "react-router-dom";

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900">{title || "Nothing here yet"}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
