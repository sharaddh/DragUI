import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveProject } from "../api/projects";
import { X, Loader2, Box, Globe, Lock } from "lucide-react";

const PROJECT_TYPES = [
  { value: "frontend", label: "Frontend", desc: "React UI project" },
  { value: "fullstack", label: "Full Stack", desc: "Frontend + Backend" },
  { value: "component", label: "Component", desc: "Single component" },
];

export default function CreateProjectModal({ open, onClose }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("frontend");
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Please enter a project name");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await saveProject({ name: name.trim(), description, type, isPublic });
      const projectId = res.data.project?.projectId || res.data.project?._id;
      onClose();
      if (projectId) navigate(`/builder?project=${projectId}`);
      else navigate("/builder");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Create New Project</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Project"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your project"
              rows={2}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Project Type</label>
            <div className="grid grid-cols-3 gap-2">
              {PROJECT_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => setType(pt.value)}
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    type === pt.value
                      ? "border-cyan-500 bg-cyan-50 ring-1 ring-cyan-500"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{pt.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{pt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 cursor-pointer">
            {isPublic ? (
              <Globe className="h-5 w-5 text-cyan-600" />
            ) : (
              <Lock className="h-5 w-5 text-slate-400" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Public project</p>
              <p className="text-xs text-slate-500">Anyone with the link can view</p>
            </div>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
          </label>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={saving || !name.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
            ) : (
              <><Box className="h-4 w-4" /> Create Project</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
