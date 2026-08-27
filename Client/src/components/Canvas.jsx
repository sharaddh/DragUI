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
      data-canvas-area="true"
      className={`relative min-h-full rounded-xl border-2 transition-all duration-150 ${
        isOver
          ? "border-cyan-400 bg-cyan-50/50 shadow-lg shadow-cyan-200/20"
          : "border-slate-200 bg-white shadow-sm"
      }`}
    >
      <div className="min-h-[calc(100vh-160px)] p-1 sm:p-2">
        {children.length === 0 ? (
          <div className="flex h-full min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-400">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-500">Drop components here</p>
              <p className="mt-1 text-xs text-slate-400">Drag from the left panel or click Add</p>
            </div>
          </div>
        ) : (
          <SortableContext items={children.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1.5">
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
