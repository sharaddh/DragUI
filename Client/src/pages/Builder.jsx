import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Canvas from "../components/Canvas";
import PropertyEditor from "../components/PropertyEditor";
import CanvasToolbar from "../components/CanvasToolbar";
import SaveButton from "../components/SaveButton";
import { useBuilderStore, componentLabels } from "../store/useBuilderStore";
import { getProject } from "../api/projects";
import { generateHTML, generateReactJSX, generatePackageJson } from "../utils/codeGenerator";
import { Loader2, ArrowLeft, Code, X, Check } from "lucide-react";

export default function Builder() {
  const addComponent = useBuilderStore((s) => s.addComponent);
  const moveComponent = useBuilderStore((s) => s.moveComponent);
  const reorderChildren = useBuilderStore((s) => s.reorderChildren);
  const tree = useBuilderStore((s) => s.tree);
  const setTree = useBuilderStore((s) => s.setTree);
  const setProjectName = useBuilderStore((s) => s.setProjectName);
  const projectName = useBuilderStore((s) => s.projectName);
  const selectedIds = useBuilderStore((s) => s.selectedIds);
  const clearSelection = useBuilderStore((s) => s.clearSelection);
  const [projectId, setProjectIdState] = useState(null);
  const [activeDrag, setActiveDrag] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [codeTab, setCodeTab] = useState("html");
  const [copied, setCopied] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const id = searchParams.get("project");
    if (id) loadProject(id);
  }, []);

  const loadProject = async (id) => {
    setLoading(true);
    try {
      const res = await getProject(id);
      const p = res.data.project;
      if (p) {
        setProjectName(p.name);
        setProjectIdState(p._id || id);
        if (p.design) setTree(p.design);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragStart = ({ active }) => {
    const data = active.data?.current || {};
    if (active.id?.toString().startsWith("tool-")) {
      setActiveDrag({
        type: data.type || "div",
        label: data.label || componentLabels[data.type] || data.type || "Component",
      });
    } else {
      setActiveDrag({ id: active.id, type: "move" });
    }
  };

  const handleDragOver = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const activeTool = active.id?.toString().startsWith("tool-");
    if (activeTool) return;

    const activeIdx = (tree.children || []).findIndex((c) => c.id === active.id);
    const overIdx = (tree.children || []).findIndex((c) => c.id === over.id);
    if (activeIdx < 0 || overIdx < 0) return;

    if (activeIdx !== overIdx) {
      const newChildren = arrayMove([...tree.children], activeIdx, overIdx);
      setTree({ ...tree, children: newChildren });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveDrag(null);
    if (!over) return;

    const isTool = active.id?.toString().startsWith("tool-");
    const data = active.data?.current || {};

    if (isTool) {
      const type = data.type || active.id.split("tool-")[1]?.split("-")[0] || "div";
      const parentId = over.id === "canvas" ? "root" : over.id?.toString() || "root";
      addComponent(type, parentId);
    } else {
      const overId = over.id?.toString();
      if (overId === "canvas" || overId === active.id) return;
    }
  };

  const handleDragCancel = () => setActiveDrag(null);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === e.currentTarget || e.target.closest("[data-canvas-area]")) {
      clearSelection();
    }
  }, [clearSelection]);

  const code = codeTab === "html" ? generateHTML(tree, projectName) : generateReactJSX(tree);
  const codeTitle = codeTab === "html" ? "HTML" : "React JSX";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          <p className="text-sm text-slate-500">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
        <div className="mb-3 flex items-center justify-between">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCode(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              <Code className="h-3.5 w-3.5" />
              Export Code
            </button>
            <SaveButton projectName={projectName} />
          </div>
        </div>

        <CanvasToolbar />

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="mt-4 grid gap-4 xl:grid-cols-[260px_1fr_300px]">
            <Sidebar />
            <div onClick={handleCanvasClick}>
              <Canvas tree={tree} />
            </div>
            <PropertyEditor />
          </div>
          <DragOverlay>
            {activeDrag ? (
              activeDrag.type === "move" ? (
                <div className="rounded-xl border-2 border-cyan-400 bg-white/90 px-4 py-2 text-xs font-semibold text-cyan-700 shadow-xl backdrop-blur-sm">
                  Move
                </div>
              ) : (
                <div className="rounded-xl border border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/30">
                  + {activeDrag.label || activeDrag.type}
                </div>
              )
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {showCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowCode(false)}>
          <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-slate-800">Export Code</h3>
                <div className="flex rounded-lg border border-slate-200 p-0.5">
                  <button
                    onClick={() => setCodeTab("html")}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition ${codeTab === "html" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    HTML
                  </button>
                  <button
                    onClick={() => setCodeTab("react")}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition ${codeTab === "react" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    React
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowCode(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-auto p-5">
              <pre className="rounded-xl bg-[#0f172a] p-4 text-xs leading-relaxed text-slate-200 overflow-x-auto font-mono">{code}</pre>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : null}
                {copied ? "Copied!" : `Copy ${codeTitle}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}