import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { useRegistry } from "../hooks/useRegistry";
import { useBuilderStore } from "../store/useBuilderStore";
import { components } from "../DropUi/index";
import { CSS_STYLE_KEYS } from "../utils/cssProps";
import ComponentPreview from "./ComponentPreview";
import { buildComponentOverrides } from "../utils/componentOverrides";

// 2. CORE INTERACTIVE DRAGGABLE ITEM COMPONENT
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

  // Sanitize style fields out of the preview layer to prevent rendering crashes
  const cleanProps = {};
  Object.entries(comp.defaultProps || {}).forEach(([key, value]) => {
    if (CSS_STYLE_KEYS && !CSS_STYLE_KEYS.has(key)) {
      cleanProps[key] = value;
    }
  });

  // Calculate real-time transformation strings safely
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
      className={`group relative rounded-3xl border bg-white p-4 transition-all duration-200 select-none ${
        isDragging 
          ? "border-cyan-400 shadow-lg ring-2 ring-cyan-100" 
          : "border-slate-200 shadow-xs hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <div className="flex flex-col gap-3">
        {/* Drag handles boundary wrapper */}
        <div 
          {...listeners} 
          {...attributes} 
          className="flex h-24 cursor-grab items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70 p-2 active:cursor-grabbing transition-colors group-hover:bg-slate-50"
          title="Drag onto Canvas"
        >
          {Comp ? (
            <div className="pointer-events-none scale-90 origin-center max-h-full max-w-full overflow-hidden">
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

        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800">{comp.label}</div>
            <p className="text-[11px] text-slate-400">Drag to target layout layer</p>
          </div>
          
          <button
            type="button"
            onClick={onDirectAdd}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-cyan-600 hover:border-cyan-200"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}

// Wrap ToolItem down here so it reference-hoists without triggering exceptions
const MemoToolItem = React.memo(ToolItem);

// 3. MAIN CONTAINER EXPORT
export default function Sidebar() {
  const registry = useRegistry();
  const addComponent = useBuilderStore((s) => s.addComponent);

  // Fallback to empty array if the custom hook returns a non-iterable entity
  const validRegistry = Array.isArray(registry) 
    ? registry.filter((comp) => comp && comp.type) 
    : [];

  const handleDirectAdd = (comp) => {
    addComponent(comp.type, "root", undefined, buildComponentOverrides(comp, comp.type));
  };

  return (
    <aside className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm h-fit max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
      <div className="mb-5 space-y-1">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Component Modules
        </h2>
        <p className="text-xs text-slate-400">
          Drag cards to the blueprint canvas workspace or use instant append.
        </p>
      </div>

      <div className="space-y-3">
        {validRegistry.length > 0 ? (
          validRegistry.map((comp, index) => (
            <MemoToolItem 
              key={`${comp.type}-${index}`} 
              comp={comp} 
              index={index} 
              onDirectAdd={() => handleDirectAdd(comp)}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
            No registry elements loaded
          </div>
        )}
      </div>
    </aside>
  );
}
