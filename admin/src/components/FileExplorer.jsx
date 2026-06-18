import { FileCode2, Image as ImageIcon, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function FileExplorer({ files, assets = [], selected, setSelected }) {
  
  const copyToClipboard = (filename) => {
    navigator.clipboard.writeText(`./${filename}`);
    toast.success(`Copied ./${filename} to clipboard!`);
  };

  return (
    <div className="w-full h-full flex flex-col font-sans">
      <div className="px-4 py-3 border-b border-white/[0.05] text-xs font-semibold text-white/50 uppercase tracking-wider">
        Explorer
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        
        {/* CODE FILES */}
        <div className="space-y-1">
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
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>

        {/* ASSET FILES (Only shows if assets are uploaded) */}
        {assets.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-white/[0.05]">
            <div className="px-3 py-1 text-[10px] font-bold text-white/30 uppercase tracking-wider">Assets</div>
            {assets.map((asset) => (
              <button
                key={asset.url}
                onClick={() => copyToClipboard(asset.name)}
                className="w-full group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.03] border border-transparent transition-all"
                title="Click to copy import path"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <ImageIcon className="w-4 h-4 text-emerald-400/70" />
                  <span className="truncate text-xs">{asset.name}</span>
                </div>
                <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}