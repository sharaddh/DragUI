import { Save, Upload, Rocket, Lock, Unlock } from "lucide-react";

export default function ComponentToolbar({ onSave, onVersion, onLock, isLocked }) {
  return (
    <div className="h-14 flex items-center justify-between px-4 font-sans">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center mr-2">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        <span className="text-white font-semibold text-sm">Editor</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onLock}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
            isLocked 
              ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20" 
              : "bg-white/[0.02] text-white/50 border-white/[0.05] hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          {isLocked ? "Locked" : "Unlocked"}
        </button>

        <div className="w-px h-6 bg-white/[0.1] mx-1" />

        <button onClick={onVersion} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/[0.02] border border-white/[0.05] text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors">
          <Upload className="w-4 h-4" />
          Version
        </button>

        <button onClick={onSave} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors">
          <Save className="w-4 h-4" />
          Save
        </button>

        <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-emerald-500 text-black hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
          <Rocket className="w-4 h-4" />
          Publish
        </button>
      </div>
    </div>
  );
}