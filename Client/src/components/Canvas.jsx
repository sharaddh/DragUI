import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Renderer from "./Renderer";
import { useBuilderStore } from "../store/useBuilderStore";

export default function Canvas({ tree }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const selectedIds = useBuilderStore((s) => s.selectedIds);
  const children = tree?.children || [];

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[70vh] rounded-xl border-2 transition-all duration-150 ${
        isOver
          ? "border-cyan-400 bg-cyan-50/50 shadow-lg shadow-cyan-200/20"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-700">Canvas</h2>
          <span className="text-xs text-slate-400">
            {children.length} element{children.length !== 1 ? "s" : ""}
          </span>
        </div>
        {selectedIds.length > 0 && (
          <span className="text-xs font-medium text-cyan-600">
            {selectedIds.length} selected
          </span>
        )}
      </div>

      <div className="min-h-[65vh] p-4">
        {children.length === 0 ? (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-400">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-500">Drop components here</p>
              <p className="mt-1 text-xs text-slate-400">Drag elements from the sidebar or click Add to start building</p>
            </div>
          </div>
        ) : (
          <SortableContext items={children.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {children.map((child) => (
                <Renderer key={child.id} node={child} depth={0} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}
