import { useState } from "react";
import { GitCommit } from "lucide-react";

export default function VersionModal({ open, onClose, onSave }) {
  const [changelog, setChangelog] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center font-sans p-4">
      <div className="bg-[#0a0a0c] border border-white/[0.08] shadow-2xl p-6 rounded-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <GitCommit className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Commit Version</h2>
            <p className="text-xs text-white/40">Log your changes for this component release.</p>
          </div>
        </div>

        <textarea
          value={changelog}
          placeholder="e.g., Added variant prop, fixed padding bug..."
          onChange={(e) => setChangelog(e.target.value)}
          rows={5}
          className="w-full bg-[#050505] border border-white/[0.08] rounded-xl p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none mb-6"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(changelog)}
            className="px-6 py-2 rounded-xl text-sm font-semibold bg-white text-black hover:bg-zinc-200 active:scale-95 transition-all"
          >
            Save Release
          </button>
        </div>
      </div>
    </div>
  );
}