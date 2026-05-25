import { create } from "zustand";

const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const useBuilderStore = create((set, get) => ({
  history: [],
  future: [],

  tree: {
    id: "root",
    type: "div",
    props: { className: "p-4 min-h-screen" },
    children: [],
  },

  selectedId: null,

  // 🔥 SAVE HISTORY
  saveHistory: () => {
    const { history, tree, selectedId } = get();
    set({
      history: [...history, { tree: clone(tree), selectedId }],
      future: [],
    });
  },

  undo: () => {
    const { history, tree, selectedId, future } = get();
    if (history.length === 0) return;

    const prev = history[history.length - 1];

    set({
      tree: prev.tree,
      selectedId: prev.selectedId,
      history: history.slice(0, -1),
      future: [{ tree: clone(tree), selectedId }, ...future],
    });
  },

  redo: () => {
    const { future, history, tree, selectedId } = get();
    if (future.length === 0) return;

    const next = future[0];

    set({
      tree: next.tree,
      selectedId: next.selectedId,
      future: future.slice(1),
      history: [...history, { tree: clone(tree), selectedId }],
    });
  },

  selectComponent: (id) => set({ selectedId: id }),

  addComponent: (parentId, component) => {
    const newTree = JSON.parse(JSON.stringify(get().tree));

    let added = false;

    function add(node) {
      if (node.id === parentId) {
        node.children.push(component);
        added = true;
        return true;
      }

      for (let child of node.children) {
        if (add(child)) return true;
      }

      return false;
    }

    add(newTree);

    if (!added) {
      newTree.children.push(component);
    }

    set({ tree: newTree, selectedId: component.id });
  },

  // 🔥 UPDATE PROPS
  updateProps: (id, newProps) => {
    get().saveHistory();

    const newTree = clone(get().tree);

    function update(node) {
      if (node.id === id) {
        node.props = { ...node.props, ...newProps };
      } else {
        node.children.forEach(update);
      }
    }

    update(newTree);

    set({ tree: newTree });
  },

  // 🔥 UPDATE SINGLE PROP (NEW)
  updateComponentProp: (id, key, value) => {
    get().updateProps(id, { [key]: value });
  },

  // 🔥 DELETE
  deleteComponent: (id) => {
    get().saveHistory();

    function remove(node) {
      node.children = node.children.filter((c) => c.id !== id);
      node.children.forEach(remove);
    }

    const newTree = clone(get().tree);
    remove(newTree);

    set({ tree: newTree, selectedId: null });
  },

  // 🔥 DUPLICATE
  duplicateComponent: (id) => {
    get().saveHistory();

    const newTree = clone(get().tree);

    function duplicate(node) {
      node.children.forEach((child, index) => {
        if (child.id === id) {
          const copy = clone(child);
          copy.id = Date.now().toString();
          node.children.splice(index + 1, 0, copy);
        } else {
          duplicate(child);
        }
      });
    }

    duplicate(newTree);
    set({ tree: newTree });
  },
}));