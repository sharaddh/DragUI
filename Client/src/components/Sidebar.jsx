import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { useRegistry } from "../hooks/useRegistry";
import { useBuilderStore } from "../store/useBuilderStore";
import { components } from "../DropUi/index";

function DynamicToolPreview({ label, props }) {
  const previewProps = props || {};
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-3 text-xs text-slate-500">
      <div className="font-semibold text-slate-800 text-left w-full truncate">{label}</div>
      {Object.keys(previewProps).length > 0 ? (
        <div className="mt-2 text-left w-full space-y-1 text-[11px] text-slate-600">
          {Object.entries(previewProps).slice(0, 3).map(([key, value]) => (
            <div key={key} className="truncate">
              <span className="font-semibold">{key}:</span> {String(value)}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2 text-slate-400">Custom component preview</div>
      )}
    </div>
  );
}

function ToolItem({ comp, index }) {
  if (!comp || !comp.type) {
    console.warn("⚠️ Invalid component:", comp);
    return null;
  }
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tool-${comp.type}-${index}`,
    data: {
      type: comp.type,
      props: comp.defaultProps,
      template: comp.template,
      label: comp.label,
    },
  });
  
  console.log("🎯 ToolItem created:", { type: comp.type, id: `tool-${comp.type}-${index}`, hasListeners: !!listeners });

  const Comp = components[comp.type];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onMouseDown={(e) => console.log("🖱️ Mousedown on ToolItem:", comp.type)}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.7 : 1,
      }}
      className="mb-3 cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100"
    >
      <div className="flex flex-col items-center">
        <div className="w-full h-20 flex items-center justify-center border border-gray-200 rounded bg-gray-50 overflow-hidden">
          {Comp ? <Comp {...comp.defaultProps} /> : <DynamicToolPreview label={comp.label} props={comp.defaultProps} />}
        </div>
        <div className="mt-2 text-center">
          <div className="font-semibold text-slate-800">{comp.label}</div>
          <div className="text-xs text-slate-500">Drag to canvas</div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const registry = useRegistry();
  const addComponent = useBuilderStore((s) => s.addComponent);
  
  const validRegistry = registry.filter((comp) => comp && comp.type);
  console.log("📦 Sidebar registry:", { total: registry.length, valid: validRegistry.length, items: validRegistry });

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Component library</h2>
          <p className="text-sm text-slate-500">Drag components into the canvas or click to add.</p>
        </div>
      </div>

      <div className="space-y-4">
        {validRegistry.map((comp, index) => (
          <div key={`${comp.type}-${index}`}>
            <ToolItem comp={comp} index={index} />
            <button
              type="button"
              onClick={() =>
                addComponent("root", {
                  id: Date.now().toString(),
                  type: comp.type,
                  template: comp.template,
                  props: { ...comp.defaultProps },
                  children: [],
                })
              }
              className="mt-2 w-full rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
            >
              Add {comp.label}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
