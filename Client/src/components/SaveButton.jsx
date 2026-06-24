import { saveProject } from "../api/projects";
import { useBuilderStore } from "../store/useBuilderStore";
import { useState } from "react";

export default function SaveButton({ projectName }) {
  const tree = useBuilderStore((s) => s.tree);
  const [isPublic, setIsPublic] = useState(false);

  const save = async () => {
    if (!projectName) {
      alert("Please enter a project name before saving.");
      return;
    }

    try {
      await saveProject({
        name: projectName,
        design: tree,
        isPublic,
      });
      alert("Saved successfully");
    } catch (error) {
      console.error(error);
      alert("Save failed. Check the server and try again.");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <input id="isPublic" type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
        <label htmlFor="isPublic" className="text-sm text-slate-700">Public</label>
      </div>
      <button
        type="button"
        onClick={save}
        className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
      >
        Save project
      </button>
    </div>
  );
}