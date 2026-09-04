import { useState } from "react";
import { useBuilderStore, componentLabels } from "../store/useBuilderStore";

const CONTAINER_TYPES = new Set(["div", "container", "section", "card", "navbar", "hero", "footer"]);

function TypeIcon({ node }) {
  const isContainer = CONTAINER_TYPES.has(node.type);
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded text-[9px] font-bold uppercase ${
        isContainer
          ? "bg-cyan-100 text-cyan-700"
          : node.type === "image" || node.type === "video"
            ? "bg-violet-100 text-violet-700"
            : "bg-slate-100 text-slate-500"
      }`}
    >
      {(node.label || componentLabels[node.type] || node.type)[0]}
    </span>
  );
}

function TreeNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2);
  const selected = useBuilderStore((s) => s.selectedIds.includes(node.id));
  const selectComponent = useBuilderStore((s) => s.selectComponent);
  const deleteComponent = useBuilderStore((s) => s.deleteComponent);
  const duplicateComponent = useBuilderStore((s) => s.duplicateComponent);

  const label = node.label || componentLabels[node.type] || node.type;
  const children = node.children || [];
  const hasChildren = children.length > 0;

  return (
    <div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          selectComponent(node.id);
        }}
        className={`group flex cursor-pointer items-center gap-1.5 rounded-md py-1 pr-1 text-xs transition-colors ${
          selected ? "bg-cyan-50 text-cyan-800" : "text-slate-600 hover:bg-slate-50"
        }`}
        style={{ paddingLeft: `${6 + depth * 12}px` }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          disabled={!hasChildren}
          className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded text-slate-400 transition-transform ${
            open ? "rotate-90" : ""
          } ${hasChildren ? "hover:bg-slate-200" : "invisible"}`}
          title={hasChildren ? (open ? "Collapse" : "Expand") : ""}
        >
          <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <TypeIcon node={node} />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <span className="hidden shrink-0 gap-0.5 group-hover:flex">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              duplicateComponent(node.id);
            }}
            className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            title="Duplicate"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteComponent(node.id);
            }}
            className="rounded p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
            title="Delete"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </span>
      </div>
      {open && hasChildren && (
        <div>
          {children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeView({ tree }) {
  const clearSelection = useBuilderStore((s) => s.clearSelection);
  const total = (() => {
    let count = 0;
    (function walk(n) {
      (n.children || []).forEach((c) => {
        count += 1;
        walk(c);
      });
    })(tree || {});
    return count;
  })();

  return (
    <div className="space-y-1">
      <div
        onClick={clearSelection}
        className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
        <span className="min-w-0 flex-1 truncate">Page Root</span>
        <span className="text-[10px] text-slate-400">{total}</span>
      </div>
      {(tree?.children || []).map((child) => (
        <TreeNode key={child.id} node={child} />
      ))}
    </div>
  );
}