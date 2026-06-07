import { useDroppable } from "@dnd-kit/core";
import Renderer from "./Renderer";

export default function Canvas({ tree }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-180 rounded-4xl border p-5 transition ${
        isOver ? "border-cyan-400 bg-cyan-50/70 shadow-sm shadow-cyan-200/30" : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Canvas</h2>
          <p className="text-sm text-slate-500">Drop components here and select to edit.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
          {isOver ? "Release to drop" : "Drag enabled"}
        </div>
      </div>

      <div className="min-h-155 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <Renderer node={tree} />
      </div>
    </div>
  );
}