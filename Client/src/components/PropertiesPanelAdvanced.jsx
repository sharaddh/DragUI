// import React, { useState } from "react";
// import { useBuilderStore } from "../store/useBuilderStore";

// export default function PropertiesPanelAdvanced() {
//   const { selectedId, updateComponentProp, tree } = useBuilderStore();
//   const [expandedSections, setExpandedSections] = useState({
//     text: true,
//     colors: false,
//     typography: false,
//     layout: false,
//     spacing: false,
//     borders: false,
//   });

//   if (!selectedId || selectedId === "root") {
//     return (
//       <aside className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm">
//         <div className="text-center py-8 text-slate-500">
//           <p className="text-sm font-medium">Select a component to edit properties</p>
//         </div>
//       </aside>
//     );
//   }

//   // Find selected component
//   const findNode = (node, id) => {
//     if (node.id === id) return node;
//     for (let child of node.children || []) {
//       const found = findNode(child, id);
//       if (found) return found;
//     }
//     return null;
//   };

//   const selected = findNode(tree, selectedId);
//   if (!selected) return null;

//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const updateProp = (key, value) => {
//     updateComponentProp(selectedId, key, value);
//   };

//   return (
//     <aside className="rounded-4xl border border-slate-200 bg-white shadow-sm overflow-y-auto max-h-[calc(100vh-200px)]">
//       <div className="sticky top-0 bg-slate-50 p-5 border-b border-slate-200">
//         <div className="space-y-2">
//           <h2 className="text-lg font-semibold text-slate-900">Design</h2>
//           <p className="text-sm text-slate-500">Edit properties for {selected.type}</p>
//         </div>
//       </div>

//       <div className="p-5 space-y-4">
//         {/* TEXT CONTENT */}
//         <PropertySection
//           title="Text Content"
//           section="text"
//           expanded={expandedSections.text}
//           onToggle={toggleSection}
//         >
//           <div className="space-y-2">
//             <label className="block text-xs font-semibold text-slate-600">Text</label>
//             <input
//               type="text"
//               value={selected.props?.text || ""}
//               onChange={(e) => updateProp("text", e.target.value)}
//               placeholder="Enter text..."
//               className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
//             />
//           </div>
//         </PropertySection>

//         {/* COLORS */}
//         <PropertySection
//           title="Colors"
//           section="colors"
//           expanded={expandedSections.colors}
//           onToggle={toggleSection}
//         >
//           <div className="space-y-4">
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label className="text-xs font-semibold text-slate-600">Text Color</label>
//                 <span
//                   className="w-5 h-5 rounded border border-slate-300"
//                   style={{ backgroundColor: selected.props?.color || "#000000" }}
//                 />
//               </div>
//               <div className="flex gap-2">
//                 <input
//                   type="color"
//                   value={selected.props?.color || "#000000"}
//                   onChange={(e) => updateProp("color", e.target.value)}
//                   className="w-12 h-10 rounded-lg cursor-pointer border border-slate-300"
//                 />
//                 <input
//                   type="text"
//                   value={selected.props?.color || "#000000"}
//                   onChange={(e) => updateProp("color", e.target.value)}
//                   className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>
//               <div className="flex gap-1 mt-2">
//                 {["#000000", "#ffffff", "#FF6B6B", "#4ECDC4", "#45B7D1"].map((color) => (
//                   <button
//                     key={color}
//                     onClick={() => updateProp("color", color)}
//                     className="w-6 h-6 rounded border-2 transition"
//                     style={{
//                       backgroundColor: color,
//                       borderColor: selected.props?.color === color ? "#000" : "#d1d5db",
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label className="text-xs font-semibold text-slate-600">Background</label>
//                 <span
//                   className="w-5 h-5 rounded border border-slate-300"
//                   style={{ backgroundColor: selected.props?.backgroundColor || "#ffffff" }}
//                 />
//               </div>
//               <div className="flex gap-2">
//                 <input
//                   type="color"
//                   value={selected.props?.backgroundColor || "#ffffff"}
//                   onChange={(e) => updateProp("backgroundColor", e.target.value)}
//                   className="w-12 h-10 rounded-lg cursor-pointer border border-slate-300"
//                 />
//                 <input
//                   type="text"
//                   value={selected.props?.backgroundColor || "#ffffff"}
//                   onChange={(e) => updateProp("backgroundColor", e.target.value)}
//                   className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>
//               <div className="flex gap-1 mt-2">
//                 {["#ffffff", "#f3f4f6", "#e5e7eb", "#d1d5db", "#6b7280"].map((color) => (
//                   <button
//                     key={color}
//                     onClick={() => updateProp("backgroundColor", color)}
//                     className="w-6 h-6 rounded border-2 transition"
//                     style={{
//                       backgroundColor: color,
//                       borderColor: selected.props?.backgroundColor === color ? "#000" : "#d1d5db",
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </PropertySection>

//         {/* TYPOGRAPHY */}
//         <PropertySection
//           title="Typography"
//           section="typography"
//           expanded={expandedSections.typography}
//           onToggle={toggleSection}
//         >
//           <div className="space-y-4">
//             <div>
//               <label className="block text-xs font-semibold text-slate-600 mb-2">Font Size</label>
//               <div className="grid grid-cols-4 gap-1">
//                 {[
//                   { value: "xs", label: "XS", px: "12px" },
//                   { value: "sm", label: "S", px: "14px" },
//                   { value: "base", label: "M", px: "16px" },
//                   { value: "lg", label: "L", px: "18px" },
//                   { value: "xl", label: "XL", px: "20px" },
//                   { value: "2xl", label: "2XL", px: "24px" },
//                   { value: "3xl", label: "3XL", px: "30px" },
//                   { value: "custom", label: "...", px: "" },
//                 ].map((size) => (
//                   <button
//                     key={size.value}
//                     onClick={() => {
//                       if (size.value !== "custom") updateProp("fontSize", size.value);
//                     }}
//                     className={`py-1 px-2 rounded text-xs font-semibold transition ${
//                       selected.props?.fontSize === size.value
//                         ? "bg-cyan-500 text-white"
//                         : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                     }`}
//                     title={size.px}
//                   >
//                     {size.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-slate-600 mb-2">Alignment</label>
//               <div className="flex gap-2">
//                 {[
//                   { value: "left", icon: "←" },
//                   { value: "center", icon: "≡" },
//                   { value: "right", icon: "→" },
//                   { value: "justify", icon: "⟷" },
//                 ].map((align) => (
//                   <button
//                     key={align.value}
//                     onClick={() => updateProp("textAlign", align.value)}
//                     className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
//                       selected.props?.textAlign === align.value
//                         ? "bg-cyan-500 text-white"
//                         : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                     }`}
//                   >
//                     {align.icon}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-slate-600 mb-2">Weight</label>
//               <div className="grid grid-cols-5 gap-1">
//                 {[
//                   { value: "300", label: "300" },
//                   { value: "400", label: "400" },
//                   { value: "600", label: "600" },
//                   { value: "700", label: "700" },
//                   { value: "800", label: "800" },
//                 ].map((weight) => (
//                   <button
//                     key={weight.value}
//                     onClick={() => updateProp("fontWeight", weight.value)}
//                     className={`py-1 rounded text-xs font-semibold transition ${
//                       selected.props?.fontWeight === weight.value
//                         ? "bg-cyan-500 text-white"
//                         : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                     }`}
//                   >
//                     {weight.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </PropertySection>

//         {/* LAYOUT */}
//         <PropertySection
//           title="Layout"
//           section="layout"
//           expanded={expandedSections.layout}
//           onToggle={toggleSection}
//         >
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-xs font-semibold text-slate-600 mb-1">Width</label>
//                 <input
//                   type="text"
//                   placeholder="100%"
//                   value={selected.props?.width || ""}
//                   onChange={(e) => updateProp("width", e.target.value)}
//                   className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-slate-600 mb-1">Height</label>
//                 <input
//                   type="text"
//                   placeholder="auto"
//                   value={selected.props?.height || ""}
//                   onChange={(e) => updateProp("height", e.target.value)}
//                   className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-slate-600 mb-2">Display</label>
//               <div className="grid grid-cols-5 gap-1">
//                 {[
//                   { value: "block", label: "█" },
//                   { value: "flex", label: "≣" },
//                   { value: "grid", label: "⊞" },
//                   { value: "inline", label: "‾" },
//                   { value: "inline-block", label: "▬" },
//                 ].map((display) => (
//                   <button
//                     key={display.value}
//                     onClick={() => updateProp("display", display.value)}
//                     className={`py-2 rounded text-xs font-bold transition ${
//                       selected.props?.display === display.value
//                         ? "bg-cyan-500 text-white"
//                         : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                     }`}
//                     title={display.value}
//                   >
//                     {display.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </PropertySection>

//         {/* SPACING - Range Sliders */}
//         <PropertySection
//           title="Spacing"
//           section="spacing"
//           expanded={expandedSections.spacing}
//           onToggle={toggleSection}
//         >
//           <div className="space-y-4">
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label className="text-xs font-semibold text-slate-600">Padding</label>
//                 <span className="text-xs text-slate-500">{selected.props?.padding || "0"}</span>
//               </div>
//               <input
//                 type="range"
//                 min="0"
//                 max="64"
//                 value={parsePaddingValue(selected.props?.padding) || 0}
//                 onChange={(e) => updateProp("padding", `${e.target.value}px`)}
//                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
//               />
//               <div className="flex gap-2 mt-2">
//                 <input
//                   type="text"
//                   placeholder="e.g., 16px"
//                   value={selected.props?.padding || ""}
//                   onChange={(e) => updateProp("padding", e.target.value)}
//                   className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>
//               <div className="flex gap-1 mt-2">
//                 {["0px", "4px", "8px", "16px", "24px", "32px"].map((val) => (
//                   <button
//                     key={val}
//                     onClick={() => updateProp("padding", val)}
//                     className={`text-xs px-2 py-1 rounded transition ${
//                       selected.props?.padding === val
//                         ? "bg-cyan-500 text-white"
//                         : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                     }`}
//                   >
//                     {val}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label className="text-xs font-semibold text-slate-600">Margin</label>
//                 <span className="text-xs text-slate-500">{selected.props?.margin || "0"}</span>
//               </div>
//               <input
//                 type="range"
//                 min="0"
//                 max="64"
//                 value={parsePaddingValue(selected.props?.margin) || 0}
//                 onChange={(e) => updateProp("margin", `${e.target.value}px`)}
//                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
//               />
//               <div className="flex gap-2 mt-2">
//                 <input
//                   type="text"
//                   placeholder="e.g., 16px"
//                   value={selected.props?.margin || ""}
//                   onChange={(e) => updateProp("margin", e.target.value)}
//                   className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 />
//               </div>
//               <div className="flex gap-1 mt-2">
//                 {["0px", "4px", "8px", "16px", "24px", "32px"].map((val) => (
//                   <button
//                     key={val}
//                     onClick={() => updateProp("margin", val)}
//                     className={`text-xs px-2 py-1 rounded transition ${
//                       selected.props?.margin === val
//                         ? "bg-cyan-500 text-white"
//                         : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                     }`}
//                   >
//                     {val}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </PropertySection>

//         {/* BORDERS & EFFECTS */}
//         <PropertySection
//           title="Borders & Effects"
//           section="borders"
//           expanded={expandedSections.borders}
//           onToggle={toggleSection}
//         >
//           <div className="space-y-4">
//             <div>
//               <label className="block text-xs font-semibold text-slate-600 mb-2">Border Radius</label>
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-xs text-slate-500">Corners</span>
//                 <span className="text-xs text-slate-500">{selected.props?.borderRadius || "0"}</span>
//               </div>
//               <input
//                 type="range"
//                 min="0"
//                 max="50"
//                 value={parsePaddingValue(selected.props?.borderRadius) || 0}
//                 onChange={(e) => updateProp("borderRadius", `${e.target.value}px`)}
//                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
//               />
//               <div className="flex gap-1 mt-2">
//                 {["0px", "4px", "8px", "16px", "24px", "50%"].map((val) => (
//                   <button
//                     key={val}
//                     onClick={() => updateProp("borderRadius", val)}
//                     className={`text-xs px-2 py-1 rounded transition ${
//                       selected.props?.borderRadius === val
//                         ? "bg-cyan-500 text-white"
//                         : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                     }`}
//                   >
//                     {val}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-slate-600 mb-2">Border</label>
//               <input
//                 type="text"
//                 placeholder="1px solid #ccc"
//                 value={selected.props?.border || ""}
//                 onChange={(e) => updateProp("border", e.target.value)}
//                 className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//               <div className="flex gap-1 mt-2">
//                 {[
//                   { label: "None", value: "none" },
//                   { label: "1px", value: "1px solid #d1d5db" },
//                   { label: "2px", value: "2px solid #d1d5db" },
//                   { label: "Blue", value: "2px solid #3b82f6" },
//                 ].map((border) => (
//                   <button
//                     key={border.value}
//                     onClick={() => updateProp("border", border.value)}
//                     className={`text-xs px-2 py-1 rounded transition ${
//                       selected.props?.border === border.value
//                         ? "bg-cyan-500 text-white"
//                         : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                     }`}
//                   >
//                     {border.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-slate-600 mb-2">Shadow</label>
//               <select
//                 value={selected.props?.boxShadow || "none"}
//                 onChange={(e) => updateProp("boxShadow", e.target.value)}
//                 className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               >
//                 <option value="none">None</option>
//                 <option value="0 1px 3px rgba(0,0,0,0.12)">Small</option>
//                 <option value="0 4px 6px rgba(0,0,0,0.16)">Medium</option>
//                 <option value="0 10px 20px rgba(0,0,0,0.19)">Large</option>
//                 <option value="0 15px 35px rgba(0,0,0,0.2)">Extra Large</option>
//               </select>
//             </div>
//           </div>
//         </PropertySection>
//       </div>
//     </aside>
//   );
// }

// function PropertySection({ title, section, expanded, onToggle, children }) {
//   return (
//     <div className="border border-slate-200 rounded-3xl overflow-hidden bg-slate-50">
//       <button
//         onClick={() => onToggle(section)}
//         className="w-full flex items-center justify-between gap-3 py-3 px-4 text-left transition hover:bg-slate-100 bg-slate-50"
//       >
//         <span className="font-semibold text-sm text-slate-900">{title}</span>
//         <span className={`text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`}>
//           ▼
//         </span>
//       </button>
//       {expanded && <div className="px-4 pb-4 bg-white border-t border-slate-200">{children}</div>}
//     </div>
//   );
// }

// // Helper to parse padding/margin values
// function parsePaddingValue(value) {
//   if (!value) return 0;
//   const match = value.match(/(\d+)/);
//   return match ? parseInt(match[1]) : 0;
// }
import React, { useState } from "react";
import { useBuilderStore } from "../store/useBuilderStore";

// Lists of text-supporting component types to conditionally render properties
const TEXT_COMPONENTS = ["text", "heading", "button", "link", "paragraph", "label"];

export default function PropertiesPanelAdvanced() {
  const selectedIds = useBuilderStore((s) => s.selectedIds);
  const updateComponentProp = useBuilderStore((s) => s.updateComponentProp);
  const tree = useBuilderStore((s) => s.tree);
  const [expandedSections, setExpandedSections] = useState({
    text: true,
    colors: true,
    typography: false,
    layout: false,
    spacing: false,
    borders: false,
  });

  const selectedId = selectedIds[0];

  if (!selectedId || selectedId === "root") {
    return (
      <aside className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm h-fit">
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm font-medium">Select a canvas element to tune properties</p>
        </div>
      </aside>
    );
  }

  // Recursive finder with defensive safety checks
  const findNode = (node, id) => {
    if (!node || typeof node !== "object") return null;
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
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateProp = (key, value) => {
    updateComponentProp(selectedId, key, value);
  };

  const isTextComponent = TEXT_COMPONENTS.includes(selected.type?.toLowerCase());
  const currentProps = selected.props || {};

  return (
    <aside className="rounded-4xl border border-slate-200 bg-white shadow-sm overflow-y-auto max-h-[calc(100vh-120px)] w-full custom-scrollbar">
      <div className="sticky top-0 bg-slate-50/90 backdrop-blur-md p-5 border-b border-slate-200 z-10">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Inspect Design</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide bg-cyan-50 border border-cyan-200 text-cyan-600 uppercase">
              {selected.type}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono truncate">ID: {selected.id}</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* TEXT CONTENT (Conditional Rendering) */}
        {isTextComponent && (
          <PropertySection
            title="Text Content"
            section="text"
            expanded={expandedSections.text}
            onToggle={toggleSection}
          >
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-slate-500">Display Text</label>
              <textarea
                value={currentProps.text || ""}
                onChange={(e) => updateProp("text", e.target.value)}
                placeholder="Type layer text contents..."
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50 resize-y transition"
              />
            </div>
          </PropertySection>
        )}

        {/* LAYOUT CONTROLS (Flexbox & CSS Grid Ready) */}
        <PropertySection
          title="Layout Engine"
          section="layout"
          expanded={expandedSections.layout}
          onToggle={toggleSection}
        >
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <UnitInput
                label="Width"
                value={currentProps.width}
                onChange={(val) => updateProp("width", val)}
                placeholder="auto"
              />
              <UnitInput
                label="Height"
                value={currentProps.height}
                onChange={(val) => updateProp("height", val)}
                placeholder="auto"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Display Mode</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { value: "block", label: "Block" },
                  { value: "flex", label: "Flex" },
                  { value: "grid", label: "Grid" },
                  { value: "inline-block", label: "Inline-B" },
                  { value: "none", label: "Hidden" },
                ].map((display) => (
                  <button
                    key={display.value}
                    onClick={() => updateProp("display", display.value)}
                    className={`py-1.5 rounded-lg text-xs font-medium transition ${
                      (currentProps.display || "block") === display.value
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {display.label}
                  </button>
                ))}
              </div>
            </div>

            {/* NESTED FLEXBOX ENGINE CONTROLS */}
            {currentProps.display === "flex" && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 animate-fadeIn">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Direction</label>
                    <select
                      value={currentProps.flexDirection || "row"}
                      onChange={(e) => updateProp("flexDirection", e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2"
                    >
                      <option value="row">Row (→)</option>
                      <option value="column">Column (↓)</option>
                      <option value="row-reverse">Row Reverse (←)</option>
                      <option value="column-reverse">Col Reverse (↑)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Wrap</label>
                    <select
                      value={currentProps.flexWrap || "nowrap"}
                      onChange={(e) => updateProp("flexWrap", e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2"
                    >
                      <option value="nowrap">No Wrap</option>
                      <option value="wrap">Wrap</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Justify Content</label>
                    <select
                      value={currentProps.justifyContent || "flex-start"}
                      onChange={(e) => updateProp("justifyContent", e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2"
                    >
                      <option value="flex-start">Start</option>
                      <option value="center">Center</option>
                      <option value="flex-end">End</option>
                      <option value="space-between">Space Between</option>
                      <option value="space-around">Space Around</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Align Items</label>
                    <select
                      value={currentProps.alignItems || "stretch"}
                      onChange={(e) => updateProp("alignItems", e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2"
                    >
                      <option value="stretch">Stretch</option>
                      <option value="flex-start">Start</option>
                      <option value="center">Center</option>
                      <option value="flex-end">End</option>
                      <option value="baseline">Baseline</option>
                    </select>
                  </div>
                </div>

                <UnitInput
                  label="Items Gap"
                  value={currentProps.gap}
                  onChange={(val) => updateProp("gap", val)}
                  placeholder="0px"
                />
              </div>
            )}

            {/* NESTED CSS GRID CONTROLS */}
            {currentProps.display === "grid" && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Grid Columns (Template)</label>
                  <input
                    type="text"
                    value={currentProps.gridTemplateColumns || "repeat(2, minmax(0, 1fr))"}
                    onChange={(e) => updateProp("gridTemplateColumns", e.target.value)}
                    placeholder="e.g., 1fr 1fr or repeat(3, 1fr)"
                    className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <UnitInput
                    label="Row Gap"
                    value={currentProps.rowGap}
                    onChange={(val) => updateProp("rowGap", val)}
                    placeholder="0px"
                  />
                  <UnitInput
                    label="Column Gap"
                    value={currentProps.columnGap}
                    onChange={(val) => updateProp("columnGap", val)}
                    placeholder="0px"
                  />
                </div>
              </div>
            )}
          </div>
        </PropertySection>

        {/* BOX MODEL SPACING ENGINE */}
        <PropertySection
          title="Box Spacing Matrix"
          section="spacing"
          expanded={expandedSections.spacing}
          onToggle={toggleSection}
        >
          <div className="space-y-4 pt-1">
            {/* Box Model Padding/Margin Visual Layout block */}
            <div>
              <span className="block text-xs font-semibold text-slate-500 mb-2">Padding Matrix</span>
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <UnitInput label="Top" value={currentProps.paddingTop} onChange={(v) => updateProp("paddingTop", v)} placeholder="0" />
                <UnitInput label="Right" value={currentProps.paddingRight} onChange={(v) => updateProp("paddingRight", v)} placeholder="0" />
                <UnitInput label="Bottom" value={currentProps.paddingBottom} onChange={(v) => updateProp("paddingBottom", v)} placeholder="0" />
                <UnitInput label="Left" value={currentProps.paddingLeft} onChange={(v) => updateProp("paddingLeft", v)} placeholder="0" />
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-500 mb-2">Margin Matrix</span>
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <UnitInput label="Top" value={currentProps.marginTop} onChange={(v) => updateProp("marginTop", v)} placeholder="0" />
                <UnitInput label="Right" value={currentProps.marginRight} onChange={(v) => updateProp("marginRight", v)} placeholder="0" />
                <UnitInput label="Bottom" value={currentProps.marginBottom} onChange={(v) => updateProp("marginBottom", v)} placeholder="0" />
                <UnitInput label="Left" value={currentProps.marginLeft} onChange={(v) => updateProp("marginLeft", v)} placeholder="0" />
              </div>
            </div>
          </div>
        </PropertySection>

        {/* COLOR SCHEMES PANEL */}
        <PropertySection
          title="Color Schemes"
          section="colors"
          expanded={expandedSections.colors}
          onToggle={toggleSection}
        >
          <div className="space-y-4 pt-1">
            <ColorPickerField
              label="Foreground (Text)"
              value={currentProps.color || "#000000"}
              onChange={(val) => updateProp("color", val)}
              swatches={["#000000", "#ffffff", "#64748b", "#3b82f6", "#ef4444", "#10b981"]}
            />
            <ColorPickerField
              label="Background Surface"
              value={currentProps.backgroundColor || "transparent"}
              onChange={(val) => updateProp("backgroundColor", val)}
              swatches={["transparent", "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#1e293b"]}
            />
          </div>
        </PropertySection>

        {/* TYPOGRAPHY CONTROLS */}
        <PropertySection
          title="Typography Styling"
          section="typography"
          expanded={expandedSections.typography}
          onToggle={toggleSection}
        >
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Font Weight</label>
                <select
                  value={currentProps.fontWeight || "400"}
                  onChange={(e) => updateProp("fontWeight", e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 p-2 font-medium"
                >
                  <option value="100">100 - Thin</option>
                  <option value="300">300 - Light</option>
                  <option value="400">400 - Regular</option>
                  <option value="500">500 - Medium</option>
                  <option value="600">600 - Semibold</option>
                  <option value="700">700 - Bold</option>
                  <option value="900">900 - Heavy</option>
                </select>
              </div>
              <UnitInput
                label="Font Size"
                value={currentProps.fontSize}
                onChange={(val) => updateProp("fontSize", val)}
                placeholder="16px"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Alignment</label>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { value: "left", label: "Left Align" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right Align" },
                  { value: "justify", label: "Justified" },
                ].map((align) => (
                  <button
                    key={align.value}
                    onClick={() => updateProp("textAlign", align.value)}
                    className={`flex-1 py-1 rounded-lg text-xs font-medium transition ${
                      currentProps.textAlign === align.value
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {align.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <UnitInput
                label="Line Height"
                value={currentProps.lineHeight}
                onChange={(val) => updateProp("lineHeight", val)}
                placeholder="normal"
              />
              <UnitInput
                label="Letter Spacing"
                value={currentProps.letterSpacing}
                onChange={(val) => updateProp("letterSpacing", val)}
                placeholder="0px"
              />
            </div>
          </div>
        </PropertySection>

        {/* BORDERS & GRAPHICS */}
        <PropertySection
          title="Borders & Graphics"
          section="borders"
          expanded={expandedSections.borders}
          onToggle={toggleSection}
        >
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <UnitInput
                label="Border Radius"
                value={currentProps.borderRadius}
                onChange={(val) => updateProp("borderRadius", val)}
                placeholder="0px"
              />
              <UnitInput
                label="Border Thickness"
                value={currentProps.borderWidth}
                onChange={(val) => updateProp("borderWidth", val)}
                placeholder="0px"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Border Style</label>
                <select
                  value={currentProps.borderStyle || "none"}
                  onChange={(e) => updateProp("borderStyle", e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 p-2"
                >
                  <option value="none">None</option>
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                </select>
              </div>
              <ColorPickerField
                label="Border Color"
                value={currentProps.borderColor || "#000000"}
                onChange={(val) => updateProp("borderColor", val)}
                swatches={["#000000", "#e2e8f0", "#3b82f6", "#ef4444"]}
                compact
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Box Shadow</label>
              <select
                value={currentProps.boxShadow || "none"}
                onChange={(e) => updateProp("boxShadow", e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 p-2 font-medium"
              >
                <option value="none">None (Flat Layer)</option>
                <option value="0 1px 3px rgba(0,0,0,0.1)">Small Subtle</option>
                <option value="0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)">Regular Shadow</option>
                <option value="0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)">Elevated Large</option>
                <option value="0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)">Deep Float</option>
              </select>
            </div>
          </div>
        </PropertySection>
      </div>
    </aside>
  );
}

// Reusable Multi-Unit Numeric Combo Field
function UnitInput({ label, value = "", onChange, placeholder = "" }) {
  const numericPart = value.match(/^[\d.-]+/)?.[0] || "";
  const unitPart = value.replace(numericPart, "") || "px";

  const handleNumChange = (num) => {
    if (num === "") return onChange("");
    onChange(`${num}${unitPart}`);
  };

  const handleUnitChange = (unit) => {
    if (numericPart === "") return;
    if (unit === "auto") return onChange("auto");
    onChange(`${numericPart}${unit}`);
  };

  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-500 mb-1">{label}</label>
      <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-cyan-500 transition">
        <input
          type="text"
          value={value === "auto" ? "" : numericPart}
          disabled={value === "auto"}
          onChange={(e) => handleNumChange(e.target.value)}
          placeholder={value === "auto" ? "auto" : placeholder}
          className="w-full px-2 py-1.5 text-xs focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 font-mono"
        />
        <select
          value={value === "auto" ? "auto" : unitPart}
          onChange={(e) => handleUnitChange(e.target.value)}
          className="border-l border-slate-100 bg-slate-50 px-1 text-[10px] font-bold text-slate-500 focus:outline-none cursor-pointer"
        >
          <option value="px">px</option>
          <option value="rem">rem</option>
          <option value="%">%</option>
          <option value="em">em</option>
          <option value="auto">auto</option>
        </select>
      </div>
    </div>
  );
}

// Unified Color Picker with Compact layout sizing adjustments
function ColorPickerField({ label, value, onChange, swatches = [], compact = false }) {
  return (
    <div>
      {!compact && <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>}
      <div className="flex gap-2 items-center">
        <div className="relative w-8 h-8 rounded-lg border border-slate-200 overflow-hidden shrink-0 shadow-xs">
          <input
            type="color"
            value={value.startsWith("#") ? value : "#ffffff"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 cursor-pointer native-color-input"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="transparent"
          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
      {!compact && (
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {swatches.map((color) => (
            <button
              key={color}
              onClick={() => onChange(color)}
              className="w-5 h-5 rounded-md border border-slate-200 transition-transform hover:scale-105"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Collapsible Property Container component
function PropertySection({ title, section, expanded, onToggle, children }) {
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
      <button
        onClick={() => onToggle(section)}
        className="w-full flex items-center justify-between gap-3 py-2.5 px-4 text-left transition hover:bg-slate-100/70 bg-slate-50"
      >
        <span className="font-bold text-xs text-slate-700 tracking-wide uppercase">{title}</span>
        <span className={`text-[10px] text-slate-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      {expanded && (
        <div className="p-3 bg-white border-t border-slate-100 space-y-3 shadow-inner-sm">
          {children}
        </div>
      )}
    </div>
  );
}