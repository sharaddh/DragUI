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