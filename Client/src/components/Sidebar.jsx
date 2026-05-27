import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { useRegistry } from "../hooks/useRegistry";
import { useBuilderStore } from "../store/useBuilderStore";
import { components } from "../DropUi/index";

function DynamicToolPreview({ label, props }) {
  const previewProps = props || {};
  return (
    <div className="flex h-full w-full flex-col justify-center rounded-3xl bg-slate-50 p-3 text-left text-xs text-slate-500">
      <div className="font-semibold text-slate-900 truncate">{label}</div>
      {Object.keys(previewProps).length > 0 ? (
        <div className="mt-2 space-y-1 text-[11px] text-slate-600">
          {Object.entries(previewProps).slice(0, 3).map(([key, value]) => (
            <div key={key} className="truncate">
              <span className="font-semibold">{key}:</span> {String(value)}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2 text-slate-400">Component preview</div>
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

  const Comp = components[comp.type];

  const CSS_STYLE_KEYS = new Set([
    "color",
    "backgroundColor",
    "fontSize",
    "textAlign",
    "fontWeight",
    "padding",
    "margin",
    "width",
    "height",
    "display",
    "border",
    "borderRadius",
    "boxShadow",
    "minHeight",
    "maxHeight",
    "minWidth",
    "maxWidth",
    "gap",
    "flexDirection",
    "justifyContent",
    "alignItems",
    "alignContent",
    "flexWrap",
  ]);

  const cleanProps = {};
  Object.entries(comp.defaultProps || {}).forEach(([key, value]) => {
    if (!CSS_STYLE_KEYS.has(key)) {
      cleanProps[key] = value;
    }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.75 : 1,
      }}
      className="mb-4 cursor-grab rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-slate-50"
    >
      <div className="flex flex-col gap-3">
        <div className="flex h-24 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
          {Comp ? <Comp {...cleanProps} /> : <DynamicToolPreview label={comp.label} props={cleanProps} />}
        </div>
        <div className="space-y-1">
          <div className="text-sm font-semibold text-slate-900">{comp.label}</div>
          <p className="text-xs text-slate-500">Drag to canvas or tap Add</p>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const registry = useRegistry();
  const addComponent = useBuilderStore((s) => s.addComponent);
  const validRegistry = registry.filter((comp) => comp && comp.type);

  return (
    <aside className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex flex-col gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Component library</h2>
          <p className="text-sm text-slate-500">Drag elements onto the canvas or add directly.</p>
        </div>
      </div>

      <div className="space-y-5">
        {validRegistry.map((comp, index) => (
          <div key={`${comp.type}-${index}`} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
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
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600"
            >
              Add {comp.label}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
