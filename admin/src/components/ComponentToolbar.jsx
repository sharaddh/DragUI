import { Save, Upload, Rocket, Lock, Unlock, Edit2 } from "lucide-react";

export default function ComponentToolbar({ onSave, onVersion, onLock, isLocked, componentName, onNameChange }) {
  return (
    <div className="h-14 flex items-center justify-between px-4 font-sans border-b border-white/[0.05] bg-[#0a0a0c] shrink-0">
      
      {/* 🟢 EDITABLE COMPONENT NAME (Removed static "Editor" text) */}
      <div className="flex items-center gap-2 group">
        <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center mr-2 shrink-0">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        <input 
          value={componentName}
          onChange={(e) => onNameChange(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
          placeholder="ComponentName"
          className="bg-transparent text-white font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 rounded px-1.5 py-0.5 w-48 transition-all hover:bg-white/[0.05]"
        />
        <Edit2 className="w-3.5 h-3.5 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onLock} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/[0.02] text-white/50 border border-white/[0.05] hover:text-white hover:bg-white/[0.05]">
          {isLocked ? <Lock className="w-4 h-4 text-yellow-500" /> : <Unlock className="w-4 h-4" />}
          {isLocked ? "Locked" : "Unlocked"}
        </button>

        <div className="w-px h-6 bg-white/[0.1] mx-1" />

        <button onClick={onVersion} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/[0.02] border border-white/[0.05] text-white/70 hover:text-white hover:bg-white/[0.05]">
          <Upload className="w-4 h-4" />
          Version
        </button>

        <button onClick={onSave} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20">
          <Save className="w-4 h-4" />
          Save
        </button>

        <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-emerald-500 text-black hover:bg-emerald-400">
          <Rocket className="w-4 h-4" />
          Publish
        </button>
      </div>
    </div>
  );
}