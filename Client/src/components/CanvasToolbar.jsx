import { useBuilderStore } from "../store/useBuilderStore";
import { useEffect, useCallback } from "react";

export default function CanvasToolbar() {
  const zoom = useBuilderStore((s) => s.zoom);
  const setZoom = useBuilderStore((s) => s.setZoom);
  const showGrid = useBuilderStore((s) => s.showGrid);
  const toggleGrid = useBuilderStore((s) => s.toggleGrid);
  const snapToGrid = useBuilderStore((s) => s.snapToGrid);
  const toggleSnap = useBuilderStore((s) => s.toggleSnap);
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const history = useBuilderStore((s) => s.history);
  const future = useBuilderStore((s) => s.future);
  const deleteSelected = useBuilderStore((s) => s.deleteSelected);
  const copySelected = useBuilderStore((s) => s.copySelected);
  const pasteClipboard = useBuilderStore((s) => s.pasteClipboard);
  const clipboard = useBuilderStore((s) => s.clipboard);
  const duplicateSelected = useBuilderStore((s) => s.duplicateSelected);
  const selectedIds = useBuilderStore((s) => s.selectedIds);

  const handleKeyDown = useCallback((e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;

    const mod = e.metaKey || e.ctrlKey;

    if (mod && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
    if (mod && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); }
    if (mod && e.key === "c") { e.preventDefault(); copySelected(); }
    if (mod && e.key === "v") { e.preventDefault(); pasteClipboard(); }
    if (mod && e.key === "d") { e.preventDefault(); duplicateSelected(); }
    if (e.key === "Delete" || e.key === "Backspace") { deleteSelected(); }
    if (mod && e.key === "=") { e.preventDefault(); setZoom(zoom + 10); }
    if (mod && e.key === "-") { e.preventDefault(); setZoom(zoom - 10); }
    if (mod && e.key === "0") { e.preventDefault(); setZoom(100); }
  }, [undo, redo, copySelected, pasteClipboard, duplicateSelected, deleteSelected, zoom, setZoom]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={!history.length}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
        </button>
        <button
          onClick={redo}
          disabled={!future.length}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
        </button>

        <div className="mx-2 h-5 w-px bg-slate-200" />

        <button
          onClick={copySelected}
          disabled={!selectedIds.length}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Copy (Ctrl+C)"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </button>
        <button
          onClick={pasteClipboard}
          disabled={!clipboard?.length}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Paste (Ctrl+V)"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </button>
        <button
          onClick={duplicateSelected}
          disabled={!selectedIds.length}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Duplicate (Ctrl+D)"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        </button>

        <div className="mx-2 h-5 w-px bg-slate-200" />

        <button
          onClick={() => deleteSelected()}
          disabled={!selectedIds.length}
          className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Delete (Del)"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleGrid}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
            showGrid ? "bg-cyan-50 text-cyan-700" : "text-slate-500 hover:bg-slate-100"
          }`}
          title="Toggle Grid"
        >
          Grid
        </button>
        <button
          onClick={toggleSnap}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
            snapToGrid ? "bg-cyan-50 text-cyan-700" : "text-slate-500 hover:bg-slate-100"
          }`}
          title="Snap to Grid"
        >
          Snap
        </button>

        <div className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1">
          <button
            onClick={() => setZoom(zoom - 10)}
            className="p-0.5 text-slate-500 hover:text-slate-700"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
          </button>
          <span className="min-w-[40px] text-center text-xs font-mono text-slate-600">{zoom}%</span>
          <button
            onClick={() => setZoom(zoom + 10)}
            className="p-0.5 text-slate-500 hover:text-slate-700"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}