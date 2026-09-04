import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Canvas from "../components/Canvas";
import PropertyEditor from "../components/PropertyEditor";
import CanvasToolbar from "../components/CanvasToolbar";
import SaveButton from "../components/SaveButton";
import { useBuilderStore, componentLabels } from "../store/useBuilderStore";
import { getProject } from "../api/projects";
import { buildComponentOverrides } from "../utils/componentOverrides";
import { generateHTML, generateReactJSX } from "../utils/codeGenerator";
import { Loader2, Code, X, Check } from "lucide-react";

export default function Builder() {
  const addComponent = useBuilderStore((s) => s.addComponent);
  const liveReorder = useBuilderStore((s) => s.liveReorder);
  const saveHistory = useBuilderStore((s) => s.saveHistory);
  const tree = useBuilderStore((s) => s.tree);
  const setTree = useBuilderStore((s) => s.setTree);
  const setProjectName = useBuilderStore((s) => s.setProjectName);
  const setProjectId = useBuilderStore((s) => s.setProjectId);
  const resetProject = useBuilderStore((s) => s.resetProject);
  const projectName = useBuilderStore((s) => s.projectName);
  const clearSelection = useBuilderStore((s) => s.clearSelection);
  const [activeDrag, setActiveDrag] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [failedId, setFailedId] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [codeTab, setCodeTab] = useState("html");
  const [copied, setCopied] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate("/projects");
  }, [navigate]);

  const loadProject = useCallback(async (id) => {
    setLoading(true);
    setLoadError(null);
    setFailedId(null);
    try {
      const res = await getProject(id);
      const p = res.data.project;
      if (p) {
        setProjectName(p.name);
        setProjectId(p.projectId || p._id || id);
        if (p.design) setTree(p.design);
      } else {
        setLoadError("Project not found.");
        setFailedId(id);
      }
    } catch {
      setLoadError("Failed to load project. Check the server and try again.");
      setFailedId(id);
    } finally {
      setLoading(false);
    }
  }, [setProjectName, setProjectId, setTree]);

  useEffect(() => {
    const id = searchParams.get("project");
    if (id) loadProject(id);
  }, [searchParams, loadProject]);

  useEffect(() => {
    if (!searchParams.get("project")) resetProject();
  }, [searchParams, resetProject]);

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
      saveHistory();
      setActiveDrag({ id: active.id, type: "move" });
    }
  };

  const handleDragOver = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const activeTool = active.id?.toString().startsWith("tool-");
    if (activeTool) return;
    liveReorder(active.id, over.id);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveDrag(null);
    if (!over) return;

    const isTool = active.id?.toString().startsWith("tool-");
    const data = active.data?.current || {};

    if (isTool) {
      const type = data.type || active.id.split("tool-")[1]?.split("-")[0] || "div";
      const parentId = over.id === "canvas" ? "root" : over.id?.toString() || "root";
      addComponent(type, parentId, undefined, buildComponentOverrides(data, type));
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

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <p className="text-sm font-medium text-slate-700">{loadError}</p>
        <div className="flex gap-3">
          <button
            onClick={() => failedId && loadProject(failedId)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
          >
            Retry
          </button>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Back to projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <Navbar
        builder
        projectName={projectName}
        onBack={handleBack}
        onExport={() => setShowCode(true)}
        rightActions={
          <SaveButton projectName={projectName} />
        }
      />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex flex-1 min-h-0">
          {/* Left: components */}
          <div className="w-[264px] shrink-0 border-r border-slate-200 bg-white">
            <Sidebar />
          </div>

          {/* Center: canvas with toolbar */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="border-b border-slate-200 bg-white">
              <CanvasToolbar />
            </div>
            <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-6" onClick={handleCanvasClick}>
              <Canvas tree={tree} />
            </div>
          </div>

          {/* Right: properties */}
          <div className="w-[312px] shrink-0 border-l border-slate-200 bg-white overflow-y-auto custom-scrollbar">
            <PropertyEditor />
          </div>
        </div>

        <DragOverlay>
          {activeDrag ? (
            activeDrag.type === "move" ? (
              <div className="rounded-lg border-2 border-cyan-400 bg-white/90 px-3 py-1.5 text-xs font-semibold text-cyan-700 shadow-xl backdrop-blur-sm">
                Move
              </div>
            ) : (
              <div className="rounded-lg border border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/30">
                + {activeDrag.label || activeDrag.type}
              </div>
            )
          ) : null}
        </DragOverlay>
      </DndContext>

      {showCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowCode(false)}>
          <div className="relative w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
            <div className="max-h-[65vh] overflow-auto p-5">
              <pre className="rounded-xl bg-[#0f172a] p-4 text-xs leading-relaxed text-slate-200 overflow-x-auto font-mono">{code}</pre>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
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