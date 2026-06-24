import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useBuilderStore, componentLabels } from "../store/useBuilderStore";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";

const TEXT_TYPES = new Set(["text", "heading", "paragraph", "link", "button"]);

function ResizeHandle({ position, onResize }) {
  const posClass = {
    "top": "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-n-resize",
    "bottom": "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-s-resize",
    "left": "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-w-resize",
    "right": "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-e-resize",
    "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize",
    "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize",
    "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize",
    "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize",
  };

  return (
    <div
      className={`absolute z-20 h-3 w-3 rounded-full border-2 border-white bg-cyan-500 shadow-sm ${posClass[position] || ""}`}
      onMouseDown={(e) => {
        e.stopPropagation();
        onResize?.(position, e);
      }}
    />
  );
}

function renderElement(node, isSelected, selectComponent, updateProps, editingTextId, setEditingText) {
  const p = node.props || {};
  const style = p.style || {};
  const combinedStyle = { ...style, position: "relative" };

  if (isSelected) {
    combinedStyle.outline = "2px solid #06b6d4";
    combinedStyle.outlineOffset = "2px";
  }

  switch (node.type) {
    case "heading": {
      const level = p.level || "h2";
      const Tag = level;
      return (
        <Tag
          style={combinedStyle}
          className={p.className}
          onClick={(e) => { e.stopPropagation(); selectComponent(node.id); }}
          onDoubleClick={() => setEditingText(node.id)}
          contentEditable={editingTextId === node.id}
          suppressContentEditableWarning
          onBlur={(e) => { updateProps(node.id, { text: e.currentTarget.textContent }); setEditingText(null); }}
        >
          {p.text || "Heading"}
        </Tag>
      );
    }
    case "text":
      return (
        <span
          style={combinedStyle}
          className={p.className}
          onClick={(e) => { e.stopPropagation(); selectComponent(node.id); }}
          onDoubleClick={() => setEditingText(node.id)}
          contentEditable={editingTextId === node.id}
          suppressContentEditableWarning
          onBlur={(e) => { updateProps(node.id, { text: e.currentTarget.textContent }); setEditingText(null); }}
        >
          {p.text || "Text"}
        </span>
      );
    case "paragraph":
      return (
        <p
          style={combinedStyle}
          className={p.className}
          onClick={(e) => { e.stopPropagation(); selectComponent(node.id); }}
          onDoubleClick={() => setEditingText(node.id)}
          contentEditable={editingTextId === node.id}
          suppressContentEditableWarning
          onBlur={(e) => { updateProps(node.id, { text: e.currentTarget.textContent }); setEditingText(null); }}
        >
          {p.text || "Paragraph"}
        </p>
      );
    case "button":
      return (
        <button
          style={combinedStyle}
          className={p.className}
          onClick={(e) => { e.stopPropagation(); selectComponent(node.id); }}
          onDoubleClick={() => setEditingText(node.id)}
          contentEditable={editingTextId === node.id}
          suppressContentEditableWarning
          onBlur={(e) => { updateProps(node.id, { text: e.currentTarget.textContent }); setEditingText(null); }}
        >
          {p.text || "Button"}
        </button>
      );
    case "link":
      return (
        <a
          href={p.href || "#"}
          style={combinedStyle}
          className={p.className}
          onClick={(e) => { e.stopPropagation(); selectComponent(node.id); }}
          onDoubleClick={() => setEditingText(node.id)}
          contentEditable={editingTextId === node.id}
          suppressContentEditableWarning
          onBlur={(e) => { updateProps(node.id, { text: e.currentTarget.textContent }); setEditingText(null); }}
        >
          {p.text || "Link"}
        </a>
      );
    case "image":
      return (
        <img
          src={p.src || "https://placehold.co/600x400/e2e8f0/64748b?text=Image"}
          alt={p.alt || ""}
          style={combinedStyle}
          className={p.className}
          onClick={(e) => { e.stopPropagation(); selectComponent(node.id); }}
          draggable={false}
        />
      );
    case "input":
      return (
        <div style={combinedStyle} className={p.className} onClick={(e) => { e.stopPropagation(); selectComponent(node.id); }}>
          {p.label && <label className="mb-1 block text-sm font-medium text-slate-700">{p.label}</label>}
          <input
            type={p.type || "text"}
            placeholder={p.placeholder || ""}
            style={{ width: "100%", padding: "10px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px" }}
            readOnly
          />
        </div>
      );
    case "divider":
      return <hr style={combinedStyle} className={p.className} onClick={(e) => { e.stopPropagation(); selectComponent(node.id); }} />;
    case "icon":
      return (
        <div style={combinedStyle} className={p.className} onClick={(e) => { e.stopPropagation(); selectComponent(node.id); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "100%", height: "100%" }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      );
    case "video":
      return (
        <div style={combinedStyle} className={p.className} onClick={(e) => { e.stopPropagation(); selectComponent(node.id); }}>
          <iframe
            src={p.src || ""}
            style={{ width: "100%", height: "100%", minHeight: "200px", borderRadius: "8px", border: "none" }}
            allowFullScreen
            title="video"
          />
        </div>
      );
    case "list":
      const ListTag = p.ordered ? "ol" : "ul";
      return (
        <ListTag style={combinedStyle} className={p.className} onClick={(e) => { e.stopPropagation(); selectComponent(node.id); }}>
          {(p.items || ["Item"]).map((item, i) => (
            <li key={i} style={{ marginBottom: "4px" }}>{item}</li>
          ))}
        </ListTag>
      );
    case "card":
    case "div":
    case "container":
    case "section":
    case "navbar":
    case "hero":
    case "footer":
    default:
      return (
        <div
          style={combinedStyle}
          className={p.className}
          onClick={(e) => { e.stopPropagation(); selectComponent(node.id); }}
        >
          {p.text && <span>{p.text}</span>}
        </div>
      );
  }
}

export default function Renderer({ node, depth = 0 }) {
  const selectedIds = useBuilderStore((s) => s.selectedIds);
  const selectComponent = useBuilderStore((s) => s.selectComponent);
  const updateProps = useBuilderStore((s) => s.updateProps);
  const editingTextId = useBuilderStore((s) => s.editingTextId);
  const setEditingText = useBuilderStore((s) => s.setEditingText);
  const tree = useBuilderStore((s) => s.tree);
  const [hovered, setHovered] = useState(false);

  const isSelected = selectedIds.includes(node.id);
  const isRoot = node.id === "root";
  const children = node.children || [];

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: node.id,
    disabled: isRoot || node.locked,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
  };

  const label = componentLabels[node.type] || node.type;

  if (isRoot) {
    return (
      <div ref={setNodeRef} style={style}>
        {children.map((child) => (
          <Renderer key={child.id} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`group relative rounded transition-all ${isDragging ? "z-50" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Element type badge on hover */}
      {hovered && !isSelected && (
        <div className="absolute -top-5 left-0 z-30 rounded-t bg-cyan-500 px-1.5 py-0.5 text-[10px] font-medium text-white whitespace-nowrap">
          {label}
        </div>
      )}

      {/* Selected element toolbar */}
      {isSelected && (
        <div className="absolute -top-8 left-0 z-30 flex items-center gap-1 rounded-t-lg bg-cyan-500 px-2 py-1 shadow-lg">
          <span className="text-[10px] font-medium text-white mr-1">{label}</span>
          <button
            className="rounded p-0.5 text-white/80 hover:bg-white/20 hover:text-white"
            onClick={(e) => { e.stopPropagation(); useBuilderStore.getState().duplicateComponent(node.id); }}
            title="Duplicate"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </button>
          <button
            className="rounded p-0.5 text-white/80 hover:bg-white/20 hover:text-white"
            onClick={(e) => { e.stopPropagation(); useBuilderStore.getState().deleteComponent(node.id); }}
            title="Delete"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      )}

      {/* Resize handles on selected */}
      {isSelected && (
        <>
          {["top-left", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left"].map((pos) => (
            <ResizeHandle
              key={pos}
              position={pos}
              onResize={(position, e) => {
                const startX = e.clientX;
                const startY = e.clientY;
                const el = e.target.closest("[data-element-id]") || e.target.parentElement;
                const currentStyle = node.props?.style || {};
                const startWidth = parseFloat(currentStyle.width) || el?.offsetWidth || 200;
                const startHeight = parseFloat(currentStyle.height) || el?.offsetHeight || 100;

                const handleMouseMove = (me) => {
                  const dx = me.clientX - startX;
                  const dy = me.clientY - startY;
                  const newStyle = {};
                  if (position.includes("right")) newStyle.width = `${Math.max(50, startWidth + dx)}px`;
                  if (position.includes("bottom")) newStyle.height = `${Math.max(30, startHeight + dy)}px`;
                  if (position.includes("left")) {
                    newStyle.width = `${Math.max(50, startWidth - dx)}px`;
                    newStyle.marginLeft = `${dx}px`;
                  }
                  if (position.includes("top")) {
                    newStyle.height = `${Math.max(30, startHeight - dy)}px`;
                    newStyle.marginTop = `${dy}px`;
                  }
                  useBuilderStore.getState().updateStyle(node.id, newStyle);
                };

                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                };

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }}
            />
          ))}
        </>
      )}

      {/* The actual element */}
      <div data-element-id={node.id}>
        {renderElement(node, isSelected, selectComponent, updateProps, editingTextId, setEditingText)}

        {/* Children */}
        {children.length > 0 && (
          <div className={node.type === "list" || node.type === "navbar" || node.type === "hero" ? "" : "space-y-1"}>
            {children.map((child) => (
              <Renderer key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}