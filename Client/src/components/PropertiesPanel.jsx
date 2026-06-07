// import { useBuilderStore } from "../store/useBuilderStore";

// export default function PropertiesPanel() {
//   const {
//     tree,
//     selectedId,
//     updateProps,
//     deleteComponent,
//     duplicateComponent,
//   } = useBuilderStore();

//   function find(node) {
//     if (node.id === selectedId) return node;
//     for (let child of node.children) {
//       const found = find(child);
//       if (found) return found;
//     }
//   }

//   const selected = find(tree);

//   if (!selected) return <div className="w-1/4 p-4">No selection</div>;

//   return (
//     <div className="w-1/4 p-4 border-l space-y-3">
//       <h3 className="font-bold">{selected.type}</h3>

//       {/* TEXT */}
//       {"text" in selected.props && (
//         <input
//           value={selected.props.text}
//           onChange={(e) =>
//             updateProps(selected.id, { text: e.target.value })
//           }
//           className="border p-2 w-full"
//         />
//       )}

//       {/* CLASS */}
//       <input
//         value={selected.props.className || ""}
//         onChange={(e) =>
//           updateProps(selected.id, { className: e.target.value })
//         }
//         className="border p-2 w-full"
//         placeholder="Tailwind classes"
//       />

//       <button
//         onClick={() => duplicateComponent(selected.id)}
//         className="bg-yellow-400 p-2 w-full"
//       >
//         Duplicate
//       </button>

//       <button
//         onClick={() => deleteComponent(selected.id)}
//         className="bg-red-500 text-white p-2 w-full"
//       >
//         Delete
//       </button>
//     </div>
//   );
// }
import { useBuilderStore } from "../store/useBuilderStore";

export default function PropertiesPanel() {
  const {
    tree,
    selectedId,
    updateComponentProp, // Or updateProps if your store supports batch object updates
    deleteComponent,
    duplicateComponent,
  } = useBuilderStore();

  // Defensive recursive lookup helper
  const findNode = (node, id) => {
    if (!node || !id) return null;
    if (node.id === id) return node;
    
    // Safely look into children using optional chaining or logical fallback arrays
    const children = node.children || [];
    for (let child of children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  const selected = findNode(tree, selectedId);

  // Match the clean, modern look of the rest of your app UI layout
  if (!selected || selectedId === "root") {
    return (
      <aside className="w-full xl:w-80 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm font-medium">Select an item to view quick actions</p>
        </div>
      </aside>
    );
  }

  const currentProps = selected.props || {};

  return (
    <aside className="w-full xl:w-80 rounded-4xl border border-slate-200 bg-white p-5 shadow-sm space-y-5 h-fit">
      <div className="border-b border-slate-100 pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 capitalize">{selected.type}</h3>
          <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-2 py-0.5 rounded">
            Quick Actions
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* TEXT PROP ENTRY */}
        {"text" in currentProps && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Element Text</label>
            <input
              type="text"
              value={currentProps.text || ""}
              onChange={(e) =>
                updateComponentProp(selected.id, "text", e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              placeholder="Text value..."
            />
          </div>
        )}

        {/* TAILWIND CLASS UTILITY STRING ENTRY */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Tailwind Classes</label>
          <input
            type="text"
            value={currentProps.className || ""}
            onChange={(e) =>
              updateComponentProp(selected.id, "className", e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            placeholder="e.g., bg-blue-500 p-4 custom-class"
          />
        </div>
      </div>

      {/* NODE MANIPULATION ACTIONS */}
      <div className="pt-2 space-y-2">
        <button
          type="button"
          onClick={() => duplicateComponent(selected.id)}
          className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 p-2.5 text-xs font-semibold shadow-xs transition"
        >
          Duplicate Element
        </button>

        <button
          type="button"
          onClick={() => deleteComponent(selected.id)}
          className="w-full rounded-xl bg-red-50 text-red-600 hover:bg-red-100/70 p-2.5 text-xs font-semibold transition"
        >
          Delete Element
        </button>
      </div>
    </aside>
  );
}