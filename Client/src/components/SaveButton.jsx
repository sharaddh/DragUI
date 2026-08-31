import { saveProject } from "../api/projects";
import { useBuilderStore } from "../store/useBuilderStore";
import { useState, useEffect, useCallback } from "react";
import { Save, Check } from "lucide-react";

export default function SaveButton({ projectName }) {
  const tree = useBuilderStore((s) => s.tree);
  const projectId = useBuilderStore((s) => s.projectId);
  const setTriggerSave = useBuilderStore((s) => s.setTriggerSave);
  const [isPublic, setIsPublic] = useState(false);
  const [state, setState] = useState("idle");

  const save = useCallback(async () => {
    if (!projectName) {
      setState("error");
      setTimeout(() => setState("idle"), 2500);
      return;
    }

    try {
      setState("saving");
      await saveProject({
        projectId,
        name: projectName,
        design: tree,
        isPublic,
        isPublished: isPublic,
      });
      setState("saved");
      setTimeout(() => setState("idle"), 2500);
    } catch (error) {
      console.error(error);
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  }, [projectName, projectId, tree, isPublic]);

  // Register save for keyboard shortcut (Ctrl+S)
  useEffect(() => {
    setTriggerSave(() => save);
    return () => setTriggerSave(null);
  }, [save, setTriggerSave]);

  return (
    <div className="flex items-center gap-2.5">
      <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-600 select-none" title="Make this project public">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-3.5 w-3.5 accent-emerald-500"
        />
        Public
      </label>
      <button
        type="button"
        onClick={save}
        disabled={state === "saving"}
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:opacity-60"
      >
        {state === "saving" ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : state === "saved" ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Save className="h-3.5 w-3.5" />
        )}
        {state === "saved" ? "Saved" : state === "saving" ? "Saving..." : "Save"}
      </button>
      {state === "error" && (
        <span className="text-xs font-medium text-red-500">Failed to save</span>
      )}
    </div>
  );
}
