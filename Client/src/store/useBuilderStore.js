import { create } from "zustand";

const clone = (obj) => JSON.parse(JSON.stringify(obj));

let idCounter = Date.now();
const genId = () => `el_${++idCounter}_${Math.random().toString(36).slice(2, 6)}`;

export const defaultComponentProps = {
  div: { className: "", style: { minHeight: "60px" }, text: "" },
  text: { className: "", style: { fontSize: "16px", color: "#0f172a" }, text: "Double-click to edit text" },
  heading: { className: "", style: { fontSize: "32px", fontWeight: "700", color: "#0f172a" }, text: "Heading", level: "h2" },
  paragraph: { className: "", style: { fontSize: "16px", lineHeight: "1.6", color: "#334155" }, text: "Paragraph text goes here." },
  button: { className: "", style: { backgroundColor: "#3b82f6", color: "#ffffff", padding: "10px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer" }, text: "Click Me", href: "" },
  image: { className: "", style: { width: "100%", maxWidth: "400px", borderRadius: "8px" }, src: "https://placehold.co/600x400/e2e8f0/64748b?text=Image", alt: "Placeholder" },
  input: { className: "", style: { padding: "10px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", width: "100%" }, placeholder: "Enter text...", type: "text", label: "" },
  link: { className: "", style: { color: "#3b82f6", fontSize: "14px", textDecoration: "underline" }, text: "Click here", href: "#" },
  divider: { className: "", style: { height: "1px", backgroundColor: "#e2e8f0", margin: "16px 0", border: "none" } },
  card: { className: "", style: { backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }, text: "" },
  list: { className: "", style: { paddingLeft: "20px", fontSize: "14px", color: "#334155" }, items: ["Item 1", "Item 2", "Item 3"], ordered: false },
  icon: { className: "", style: { width: "24px", height: "24px", color: "#64748b" }, icon: "star" },
  video: { className: "", style: { width: "100%", maxWidth: "560px", borderRadius: "8px" }, src: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  navbar: { className: "", style: { backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }, text: "Brand", links: ["Home", "About", "Contact"] },
  hero: { className: "", style: { padding: "80px 24px", textAlign: "center", backgroundColor: "#f8fafc" }, title: "Hero Title", subtitle: "Subtitle goes here" },
  container: { className: "", style: { maxWidth: "1200px", margin: "0 auto", padding: "0 24px" } },
  section: { className: "", style: { padding: "60px 24px" } },
  footer: { className: "", style: { backgroundColor: "#0f172a", color: "#ffffff", padding: "40px 24px", textAlign: "center" }, text: "© 2026 Your Company. All rights reserved." },
};

export const componentLabels = {
  div: "Box", text: "Text", heading: "Heading", paragraph: "Paragraph",
  button: "Button", image: "Image", input: "Input", link: "Link",
  divider: "Divider", card: "Card", list: "List", icon: "Icon",
  video: "Video", navbar: "Navbar", hero: "Hero", container: "Container",
  section: "Section", footer: "Footer",
};

export const createComponentNode = (type, overrides = {}) => ({
  id: genId(),
  type,
  props: { ...clone(defaultComponentProps[type] || defaultComponentProps.div), ...overrides },
  children: [],
  locked: false,
  visible: true,
  ...overrides,
});

export const useBuilderStore = create((set, get) => ({
  tree: { id: "root", type: "root", props: { className: "min-h-screen bg-white" }, children: [] },
  selectedIds: [],
  history: [],
  future: [],
  clipboard: null,
  projectId: null,
  projectName: "Untitled Project",
  zoom: 100,
  showGrid: true,
  snapToGrid: false,
  editingTextId: null,

  selectComponent: (id, multi = false) => {
    if (multi) {
      set((s) => ({
        selectedIds: s.selectedIds.includes(id)
          ? s.selectedIds.filter((i) => i !== id)
          : [...s.selectedIds, id],
      }));
    } else {
      set({ selectedIds: id ? [id] : [] });
    }
  },

  clearSelection: () => set({ selectedIds: [], editingTextId: null }),
  setEditingText: (id) => set({ editingTextId: id }),

  saveHistory: () => {
    const { history, tree, selectedIds } = get();
    set({ history: [...history.slice(-50), { tree: clone(tree), selectedIds: [...selectedIds] }], future: [] });
  },

  undo: () => {
    const { history, tree, selectedIds, future } = get();
    if (!history.length) return;
    const prev = history[history.length - 1];
    set({
      tree: prev.tree, selectedIds: prev.selectedIds,
      history: history.slice(0, -1),
      future: [{ tree: clone(tree), selectedIds: [...selectedIds] }, ...future],
    });
  },

  redo: () => {
    const { future, history, tree, selectedIds } = get();
    if (!future.length) return;
    const next = future[0];
    set({
      tree: next.tree, selectedIds: next.selectedIds,
      future: future.slice(1),
      history: [...history, { tree: clone(tree), selectedIds: [...selectedIds] }],
    });
  },

  findNode: (id) => {
    function search(node) {
      if (node.id === id) return node;
      for (const child of node.children || []) {
        const found = search(child);
        if (found) return found;
      }
      return null;
    }
    return search(get().tree);
  },

  findParent: (id) => {
    function search(node, parent) {
      if (node.id === id) return parent;
      for (const child of node.children || []) {
        const found = search(child, node);
        if (found) return found;
      }
      return null;
    }
    return search(get().tree, null);
  },
}));
