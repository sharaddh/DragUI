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
  const clearSelection = useBuilderStore((s) => s.clearSelection);
  const children = tree?.children || [];

  const handleCanvasClick = (e) => {
    // Only deselect when clicking the canvas background itself, not any child
    if (e.target.closest("[data-element-id]")) return;
    clearSelection();
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleCanvasClick}
      data-canvas-area="true"
      className={`relative min-h-full rounded-xl border-2 transition-all duration-150 ${
        isOver
          ? "border-cyan-400 bg-cyan-50/50 shadow-lg shadow-cyan-200/20"
          : "border-slate-200 bg-white shadow-sm"
      }`}
    >
      <div className="min-h-[calc(100vh-160px)] p-1 sm:p-2">
        {children.length === 0 ? (
          <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => useBuilderStore.getState().addComponent("div", "root")}
              className="group flex flex-col items-center text-center"
            >
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 transition group-hover:border-cyan-400 group-hover:text-cyan-500">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-slate-700">Drop components here</p>
              <p className="mt-1 text-xs text-slate-400">Drag from the left panel or click to add a Box</p>
            </button>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[["div", "Box"], ["heading", "Heading"], ["text", "Text"], ["button", "Button"], ["card", "Card"]].map(([type, label]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => useBuilderStore.getState().addComponent(type, "root")}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  + {label}
                </button>
              ))}
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
