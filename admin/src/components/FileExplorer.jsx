import { FileCode2 } from "lucide-react";

export default function FileExplorer({ files, selected, setSelected }) {
  return (
    <div className="w-full h-full flex flex-col font-sans">
      <div className="px-4 py-3 border-b border-white/[0.05] text-xs font-semibold text-white/50 uppercase tracking-wider">
        Explorer
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {files.map((file) => (
          <button
            key={file.name}
            onClick={() => setSelected(file.name)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selected === file.name
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                : "text-white/60 hover:text-white hover:bg-white/[0.03] border border-transparent"
            }`}
          >
            <FileCode2 className={`w-4 h-4 ${selected === file.name ? "text-purple-400" : "text-white/40"}`} />
            {file.name}
          </button>
        ))}
      </div>
    </div>
  );
}