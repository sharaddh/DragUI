import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useRegistry } from "../hooks/useRegistry";
import { useBuilderStore } from "../store/useBuilderStore";
import { components } from "../DropUi/index";
import { CSS_STYLE_KEYS } from "../utils/cssProps";
import ComponentPreview from "./ComponentPreview";
import { buildComponentOverrides } from "../utils/componentOverrides";

// Compact draggable component item
function ToolItem({ comp, index, onDirectAdd }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tool-${comp.type}-${index}`,
    data: {
      type: comp.type,
      props: comp.defaultProps,
      template: comp.code || comp.template || "",
      thumbnail: comp.thumbnail || "",
      label: comp.label,
    },
  });

  const Comp = components[comp.type];

  const cleanProps = {};
  Object.entries(comp.defaultProps || {}).forEach(([key, value]) => {
    if (CSS_STYLE_KEYS && !CSS_STYLE_KEYS.has(key)) {
      cleanProps[key] = value;
    }
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2.5 rounded-lg border bg-white px-2 py-1.5 transition-colors select-none ${
        isDragging
          ? "border-cyan-400 bg-cyan-50 ring-2 ring-cyan-100"
          : "border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/40 cursor-grab active:cursor-grabbing"
      }`}
    >
      {/* Small preview thumb */}
      <div
        {...listeners}
        {...attributes}
        title="Drag onto canvas"
        className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-100 bg-slate-50/70"
      >
        {Comp ? (
          <div className="pointer-events-none scale-[0.45] origin-center">
            <Comp {...cleanProps} />
          </div>
        ) : (
          <ComponentPreview
            comp={{
              label: comp.label,
              code: comp.code,
              template: comp.template,
              thumbnail: comp.thumbnail,
              defaultProps: comp.defaultProps,
            }}
          />
        )}
      </div>

      <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">{comp.label}</span>

      <button
        type="button"
        onClick={onDirectAdd}
        className="shrink-0 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 transition hover:border-cyan-300 hover:text-cyan-600"
        title="Add to canvas"
      >
        + Add
      </button>
    </div>
  );
}

const MemoToolItem = React.memo(ToolItem);

export default function Sidebar() {
  const registry = useRegistry();
  const addComponent = useBuilderStore((s) => s.addComponent);
  const [query, setQuery] = useState("");

  const validRegistry = Array.isArray(registry)
    ? registry.filter((comp) => comp && comp.type)
    : [];

  const filtered = query.trim()
    ? validRegistry.filter((comp) =>
        (comp.label || comp.type).toLowerCase().includes(query.trim().toLowerCase())
      )
    : validRegistry;

  const handleDirectAdd = (comp) => {
    addComponent(comp.type, "root", undefined, buildComponentOverrides(comp, comp.type));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-slate-100 px-3 pb-2 pt-3">
        <h2 className="text-xs font-bold tracking-wide text-slate-800 uppercase">Components</h2>
      </div>

      {/* Search */}
      <div className="px-3 pt-2">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") setQuery(""); }}
            placeholder="Search components..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 pr-7 text-xs placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"
              title="Clear search (Esc)"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto p-3 custom-scrollbar">
        {filtered.length > 0 ? (
          filtered.map((comp, index) => (
            <MemoToolItem
              key={`${comp.type}-${index}`}
              comp={comp}
              index={index}
              onDirectAdd={() => handleDirectAdd(comp)}
            />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 p-5 text-center text-xs text-slate-400">
            {query ? "No matching components" : "No components loaded"}
          </div>
        )}
      </div>
    </div>
  );
}
