import { useState, useMemo } from "react";
import { useBuilderStore, componentLabels } from "../store/useBuilderStore";
import { styleFieldMeta, STYLE_FIELDS, elementCategories } from "../utils/registry";

const STYLE_TABS = [
  { id: "content", label: "Content", icon: "Aa" },
  { id: "layout", label: "Layout", icon: "⊞" },
  { id: "spacing", label: "Spacing", icon: "⇔" },
  { id: "typography", label: "Text", icon: "T" },
  { id: "background", label: "Style", icon: "◉" },
  { id: "advanced", label: "More", icon: "⋯" },
];

const LAYOUT_FIELDS = ["display", "flexDirection", "flexWrap", "justifyContent", "alignItems", "gap", "position"];
const SPACING_FIELDS = ["padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft"];
const TYPOGRAPHY_FIELDS = ["fontSize", "fontWeight", "fontFamily", "lineHeight", "letterSpacing", "textAlign", "textDecoration", "textTransform"];
const BG_FIELDS = ["backgroundColor", "color", "borderRadius", "borderWidth", "borderStyle", "borderColor", "boxShadow", "opacity"];
const ADV_FIELDS = ["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight", "overflow", "cursor", "zIndex", "transition"];

function UnitInput({ value, onChange }) {
  const num = parseFloat(value) || 0;
  const unit = value ? value.replace(/[\d.-]/g, "") || "px" : "px";

  return (
    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
      <input
        type="number"
        value={num}
        onChange={(e) => onChange(`${e.target.value}${unit}`)}
        className="w-full min-w-0 px-2 py-1.5 text-xs font-mono focus:outline-none"
        step="1"
      />
      <select
        value={unit}
        onChange={(e) => onChange(`${num}${e.target.value}`)}
        className="border-l border-slate-200 bg-slate-50 px-1 text-[10px] focus:outline-none"
      >
        <option value="px">px</option>
        <option value="rem">rem</option>
        <option value="em">em</option>
        <option value="%">%</option>
        <option value="vh">vh</option>
        <option value="vw">vw</option>
      </select>
    </div>
  );
}

function ColorInput({ value, onChange }) {
  return (
    <div className="flex gap-1.5 items-center">
      <div className="relative w-8 h-8 rounded-lg border border-slate-200 overflow-hidden shrink-0">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-12 h-12 -top-2 -left-2 cursor-pointer"
        />
      </div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
        placeholder="transparent"
      />
    </div>
  );
}

function StyleField({ field, value, onChange }) {
  const meta = styleFieldMeta[field];
  if (!meta) return null;

  if (meta.type === "color") {
    return (
      <div className="space-y-1">
        <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{meta.label}</label>
        <ColorInput value={value || ""} onChange={onChange} />
      </div>
    );
  }

  if (meta.type === "select") {
    return (
      <div className="space-y-1">
        <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{meta.label}</label>
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400 bg-white"
        >
          <option value="">Default</option>
          {(meta.options || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (meta.type === "range") {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{meta.label}</label>
          <span className="text-xs font-mono text-slate-400">{value || meta.min || 0}</span>
        </div>
        <input
          type="range"
          min={meta.min || 0}
          max={meta.max || 100}
          step={meta.step || 1}
          value={value ?? meta.min ?? 0}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full accent-cyan-500"
        />
      </div>
    );
  }

  if (meta.type === "number") {
    return (
      <div className="space-y-1">
        <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{meta.label}</label>
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : "")}
          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
        />
      </div>
    );
  }

  if (meta.type === "unit") {
    return (
      <div className="space-y-1">
        <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{meta.label}</label>
        <UnitInput value={value || ""} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{meta.label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
      />
    </div>
  );
}

export default function PropertyEditor() {
  const selectedIds = useBuilderStore((s) => s.selectedIds);
  const tree = useBuilderStore((s) => s.tree);
  const updateStyle = useBuilderStore((s) => s.updateStyle);
  const updateComponentProp = useBuilderStore((s) => s.updateComponentProp);
  const updateProps = useBuilderStore((s) => s.updateProps);
  const deleteComponent = useBuilderStore((s) => s.deleteComponent);
  const duplicateComponent = useBuilderStore((s) => s.duplicateComponent);
  const [activeTab, setActiveTab] = useState("content");

  const selectedNode = useMemo(() => {
    if (!selectedIds.length) return null;
    function search(node) {
      if (node.id === selectedIds[0]) return node;
      for (const c of node.children || []) {
        const f = search(c);
        if (f) return f;
      }
      return null;
    }
    return search(tree);
  }, [selectedIds, tree]);

  if (!selectedNode || selectedNode.id === "root") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-center text-sm text-slate-400 py-8">
          Select an element on the canvas to edit its properties
        </p>
      </div>
    );
  }

  const p = selectedNode.props || {};
  const style = p.style || {};
  const label = componentLabels[selectedNode.type] || selectedNode.type;
  const hasText = ["text", "heading", "paragraph", "button", "link"].includes(selectedNode.type);

  const handleStyleChange = (key, value) => {
    updateStyle(selectedNode.id, { [key]: value });
  };

  const handleContentChange = (key, value) => {
    updateProps(selectedNode.id, { [key]: value });
  };

  const addChild = () => {
    const { addComponent } = useBuilderStore.getState();
    addComponent("div", selectedNode.id);
  };

  const renderStyleTab = (fields) => (
    <div className="space-y-3">
      {fields.map((field) => (
        <StyleField
          key={field}
          field={field}
          value={style[field]}
          onChange={(val) => handleStyleChange(field, val)}
        />
      ))}
    </div>
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-100 text-xs font-bold text-cyan-700 uppercase">
              {label[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-[10px] font-mono text-slate-400">{selectedNode.id}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => duplicateComponent(selectedNode.id)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              title="Duplicate"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
            <button
              onClick={() => deleteComponent(selectedNode.id)}
              className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
              title="Delete"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Style Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/50">
        {STYLE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-xs font-medium transition ${
              activeTab === tab.id
                ? "border-b-2 border-cyan-500 text-cyan-700 bg-white"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-h-[calc(100vh-320px)] overflow-y-auto p-4">
        {activeTab === "content" && (
          <div className="space-y-4">
            {hasText && (
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Text Content</label>
                <textarea
                  value={p.text || ""}
                  onChange={(e) => handleContentChange("text", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 min-h-[80px] resize-y"
                  placeholder="Enter text..."
                />
              </div>
            )}
            {selectedNode.type === "heading" && (
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Heading Level</label>
                <select
                  value={p.level || "h2"}
                  onChange={(e) => handleContentChange("level", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                >
                  <option value="h1">H1</option>
                  <option value="h2">H2</option>
                  <option value="h3">H3</option>
                  <option value="h4">H4</option>
                </select>
              </div>
            )}
            {selectedNode.type === "button" && (
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Link URL</label>
                <input
                  type="text"
                  value={p.href || ""}
                  onChange={(e) => handleContentChange("href", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  placeholder="https://..."
                />
              </div>
            )}
            {selectedNode.type === "image" && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Image URL</label>
                  <input
                    type="text"
                    value={p.src || ""}
                    onChange={(e) => handleContentChange("src", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Alt Text</label>
                  <input
                    type="text"
                    value={p.alt || ""}
                    onChange={(e) => handleContentChange("alt", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </>
            )}
            {selectedNode.type === "input" && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Label</label>
                  <input
                    type="text"
                    value={p.label || ""}
                    onChange={(e) => handleContentChange("label", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Placeholder</label>
                  <input
                    type="text"
                    value={p.placeholder || ""}
                    onChange={(e) => handleContentChange("placeholder", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Input Type</label>
                  <select
                    value={p.type || "text"}
                    onChange={(e) => handleContentChange("type", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    {["text", "email", "password", "number", "tel", "url", "search"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {selectedNode.type === "link" && (
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">URL</label>
                <input
                  type="text"
                  value={p.href || ""}
                  onChange={(e) => handleContentChange("href", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  placeholder="#"
                />
              </div>
            )}
            {selectedNode.type === "list" && (
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Items (one per line)</label>
                <textarea
                  value={(p.items || []).join("\n")}
                  onChange={(e) => handleContentChange("items", e.target.value.split("\n"))}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 min-h-[100px] resize-y font-mono"
                  placeholder="Item 1&#10;Item 2&#10;Item 3"
                />
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={p.ordered || false}
                    onChange={(e) => handleContentChange("ordered", e.target.checked)}
                  />
                  Ordered list
                </label>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Class Name</label>
              <input
                type="text"
                value={p.className || ""}
                onChange={(e) => handleContentChange("className", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="tailwind classes..."
              />
            </div>
            {selectedNode.type !== "list" && selectedNode.type !== "image" && selectedNode.type !== "input" && (
              <button
                onClick={addChild}
                className="w-full rounded-lg border border-dashed border-slate-300 py-2 text-xs font-medium text-slate-500 hover:border-cyan-400 hover:text-cyan-600 transition"
              >
                + Add child element
              </button>
            )}
          </div>
        )}

        {activeTab === "layout" && renderStyleTab(LAYOUT_FIELDS)}
        {activeTab === "spacing" && renderStyleTab(SPACING_FIELDS)}
        {activeTab === "typography" && renderStyleTab(TYPOGRAPHY_FIELDS)}
        {activeTab === "background" && renderStyleTab(BG_FIELDS)}
        {activeTab === "advanced" && renderStyleTab(ADV_FIELDS)}
      </div>
    </div>
  );
}