import React, { useState } from "react";
import { useBuilderStore } from "../store/useBuilderStore";

export default function PropertiesPanelAdvanced() {
  const { selectedId, updateComponentProp, tree } = useBuilderStore();
  const [expandedSections, setExpandedSections] = useState({
    text: true,
    colors: false,
    typography: false,
    layout: false,
    spacing: false,
    borders: false,
  });

  if (!selectedId || selectedId === "root") {
    return (
      <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-center py-8 text-slate-500">
          <p>Select a component to edit properties</p>
        </div>
      </aside>
    );
  }

  // Find selected component
  const findNode = (node, id) => {
    if (node.id === id) return node;
    for (let child of node.children || []) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  const selected = findNode(tree, selectedId);
  if (!selected) return null;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateProp = (key, value) => {
    updateComponentProp(selectedId, key, value);
  };

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-y-auto max-h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="sticky top-0 bg-slate-50 p-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Design</h2>
        <p className="text-xs text-slate-500">{selected.type}</p>
      </div>

      <div className="p-4 space-y-2">
        {/* TEXT CONTENT */}
        <PropertySection
          title="Text Content"
          section="text"
          expanded={expandedSections.text}
          onToggle={toggleSection}
        >
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600">Text</label>
            <input
              type="text"
              value={selected.props?.text || ""}
              onChange={(e) => updateProp("text", e.target.value)}
              placeholder="Enter text..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </PropertySection>

        {/* COLORS */}
        <PropertySection
          title="Colors"
          section="colors"
          expanded={expandedSections.colors}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-600">Text Color</label>
                <span
                  className="w-5 h-5 rounded border border-slate-300"
                  style={{ backgroundColor: selected.props?.color || "#000000" }}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selected.props?.color || "#000000"}
                  onChange={(e) => updateProp("color", e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={selected.props?.color || "#000000"}
                  onChange={(e) => updateProp("color", e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex gap-1 mt-2">
                {["#000000", "#ffffff", "#FF6B6B", "#4ECDC4", "#45B7D1"].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProp("color", color)}
                    className="w-6 h-6 rounded border-2 transition"
                    style={{
                      backgroundColor: color,
                      borderColor: selected.props?.color === color ? "#000" : "#d1d5db",
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-600">Background</label>
                <span
                  className="w-5 h-5 rounded border border-slate-300"
                  style={{ backgroundColor: selected.props?.backgroundColor || "#ffffff" }}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selected.props?.backgroundColor || "#ffffff"}
                  onChange={(e) => updateProp("backgroundColor", e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={selected.props?.backgroundColor || "#ffffff"}
                  onChange={(e) => updateProp("backgroundColor", e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex gap-1 mt-2">
                {["#ffffff", "#f3f4f6", "#e5e7eb", "#d1d5db", "#6b7280"].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProp("backgroundColor", color)}
                    className="w-6 h-6 rounded border-2 transition"
                    style={{
                      backgroundColor: color,
                      borderColor: selected.props?.backgroundColor === color ? "#000" : "#d1d5db",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </PropertySection>

        {/* TYPOGRAPHY */}
        <PropertySection
          title="Typography"
          section="typography"
          expanded={expandedSections.typography}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Font Size</label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { value: "xs", label: "XS", px: "12px" },
                  { value: "sm", label: "S", px: "14px" },
                  { value: "base", label: "M", px: "16px" },
                  { value: "lg", label: "L", px: "18px" },
                  { value: "xl", label: "XL", px: "20px" },
                  { value: "2xl", label: "2XL", px: "24px" },
                  { value: "3xl", label: "3XL", px: "30px" },
                  { value: "custom", label: "...", px: "" },
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => {
                      if (size.value !== "custom") updateProp("fontSize", size.value);
                    }}
                    className={`py-1 px-2 rounded text-xs font-semibold transition ${
                      selected.props?.fontSize === size.value
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                    title={size.px}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Alignment</label>
              <div className="flex gap-2">
                {[
                  { value: "left", icon: "←" },
                  { value: "center", icon: "≡" },
                  { value: "right", icon: "→" },
                  { value: "justify", icon: "⟷" },
                ].map((align) => (
                  <button
                    key={align.value}
                    onClick={() => updateProp("textAlign", align.value)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                      selected.props?.textAlign === align.value
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {align.icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Weight</label>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { value: "300", label: "300" },
                  { value: "400", label: "400" },
                  { value: "600", label: "600" },
                  { value: "700", label: "700" },
                  { value: "800", label: "800" },
                ].map((weight) => (
                  <button
                    key={weight.value}
                    onClick={() => updateProp("fontWeight", weight.value)}
                    className={`py-1 rounded text-xs font-semibold transition ${
                      selected.props?.fontWeight === weight.value
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {weight.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PropertySection>

        {/* LAYOUT */}
        <PropertySection
          title="Layout"
          section="layout"
          expanded={expandedSections.layout}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Width</label>
                <input
                  type="text"
                  placeholder="100%"
                  value={selected.props?.width || ""}
                  onChange={(e) => updateProp("width", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Height</label>
                <input
                  type="text"
                  placeholder="auto"
                  value={selected.props?.height || ""}
                  onChange={(e) => updateProp("height", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Display</label>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { value: "block", label: "█" },
                  { value: "flex", label: "≣" },
                  { value: "grid", label: "⊞" },
                  { value: "inline", label: "‾" },
                  { value: "inline-block", label: "▬" },
                ].map((display) => (
                  <button
                    key={display.value}
                    onClick={() => updateProp("display", display.value)}
                    className={`py-2 rounded text-xs font-bold transition ${
                      selected.props?.display === display.value
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                    title={display.value}
                  >
                    {display.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PropertySection>

        {/* SPACING - Range Sliders */}
        <PropertySection
          title="Spacing"
          section="spacing"
          expanded={expandedSections.spacing}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-600">Padding</label>
                <span className="text-xs text-slate-500">{selected.props?.padding || "0"}</span>
              </div>
              <input
                type="range"
                min="0"
                max="64"
                value={parsePaddingValue(selected.props?.padding) || 0}
                onChange={(e) => updateProp("padding", `${e.target.value}px`)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="e.g., 16px"
                  value={selected.props?.padding || ""}
                  onChange={(e) => updateProp("padding", e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex gap-1 mt-2">
                {["0px", "4px", "8px", "16px", "24px", "32px"].map((val) => (
                  <button
                    key={val}
                    onClick={() => updateProp("padding", val)}
                    className={`text-xs px-2 py-1 rounded transition ${
                      selected.props?.padding === val
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-600">Margin</label>
                <span className="text-xs text-slate-500">{selected.props?.margin || "0"}</span>
              </div>
              <input
                type="range"
                min="0"
                max="64"
                value={parsePaddingValue(selected.props?.margin) || 0}
                onChange={(e) => updateProp("margin", `${e.target.value}px`)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="e.g., 16px"
                  value={selected.props?.margin || ""}
                  onChange={(e) => updateProp("margin", e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex gap-1 mt-2">
                {["0px", "4px", "8px", "16px", "24px", "32px"].map((val) => (
                  <button
                    key={val}
                    onClick={() => updateProp("margin", val)}
                    className={`text-xs px-2 py-1 rounded transition ${
                      selected.props?.margin === val
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PropertySection>

        {/* BORDERS & EFFECTS */}
        <PropertySection
          title="Borders & Effects"
          section="borders"
          expanded={expandedSections.borders}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Border Radius</label>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">Corners</span>
                <span className="text-xs text-slate-500">{selected.props?.borderRadius || "0"}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={parsePaddingValue(selected.props?.borderRadius) || 0}
                onChange={(e) => updateProp("borderRadius", `${e.target.value}px`)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex gap-1 mt-2">
                {["0px", "4px", "8px", "16px", "24px", "50%"].map((val) => (
                  <button
                    key={val}
                    onClick={() => updateProp("borderRadius", val)}
                    className={`text-xs px-2 py-1 rounded transition ${
                      selected.props?.borderRadius === val
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Border</label>
              <input
                type="text"
                placeholder="1px solid #ccc"
                value={selected.props?.border || ""}
                onChange={(e) => updateProp("border", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <div className="flex gap-1 mt-2">
                {[
                  { label: "None", value: "none" },
                  { label: "1px", value: "1px solid #d1d5db" },
                  { label: "2px", value: "2px solid #d1d5db" },
                  { label: "Blue", value: "2px solid #3b82f6" },
                ].map((border) => (
                  <button
                    key={border.value}
                    onClick={() => updateProp("border", border.value)}
                    className={`text-xs px-2 py-1 rounded transition ${
                      selected.props?.border === border.value
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {border.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Shadow</label>
              <select
                value={selected.props?.boxShadow || "none"}
                onChange={(e) => updateProp("boxShadow", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="none">None</option>
                <option value="0 1px 3px rgba(0,0,0,0.12)">Small</option>
                <option value="0 4px 6px rgba(0,0,0,0.16)">Medium</option>
                <option value="0 10px 20px rgba(0,0,0,0.19)">Large</option>
                <option value="0 15px 35px rgba(0,0,0,0.2)">Extra Large</option>
              </select>
            </div>
          </div>
        </PropertySection>
      </div>
    </aside>
  );
}

function PropertySection({ title, section, expanded, onToggle, children }) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
      <button
        onClick={() => onToggle(section)}
        className="w-full flex items-center justify-between py-3 px-3 hover:bg-slate-100 transition bg-slate-50"
      >
        <span className="font-semibold text-sm text-slate-900">{title}</span>
        <span className={`text-slate-500 transition transform ${expanded ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      {expanded && <div className="px-3 pb-4 bg-white border-t border-slate-200">{children}</div>}
    </div>
  );
}

// Helper to parse padding/margin values
function parsePaddingValue(value) {
  if (!value) return 0;
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}
