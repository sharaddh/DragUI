import { Pencil, Trash2, Rocket, Archive, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ComponentCard({
  component,
  onDelete,
  onPublish,
  onArchive
}) {
  const navigate = useNavigate();

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-[#0a0a0c] border border-white/[0.05] hover:border-white/[0.15] transition-all duration-300 shadow-lg">
      
      {/* --- Thumbnail Section --- */}
      <div className="relative aspect-video w-full bg-[#050505] border-b border-white/[0.05] overflow-hidden flex items-center justify-center">
        {component.thumbnail ? (
          <img 
            src={component.thumbnail} 
            alt={component.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-white/20">
            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-[10px] font-bold uppercase tracking-widest">No Preview</span>
          </div>
        )}

        {/* Floating Status Pill */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${
            component.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
            component.status === 'archived' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
            'bg-blue-500/20 text-blue-300 border-blue-500/30'
          }`}>
            {component.status || "Draft"}
          </span>
        </div>
      </div>

      {/* --- Details Section --- */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="text-lg font-bold text-white/90 truncate group-hover:text-white transition-colors">
            {component.name}
          </h3>
          <p className="text-sm text-white/40 font-medium mt-0.5">
            {component.category || "Uncategorized"}
          </p>
        </div>

        {/* --- Action Buttons Grid --- */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.05] mt-auto">
          
          <button
            onClick={() => navigate(`/components/edit/${component._id}`)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-purple-500/20 text-white/60 hover:text-purple-400 transition-colors text-sm font-medium"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>

          <div className="flex items-center gap-1">
            {component.status !== 'published' && (
              <button 
                onClick={() => onPublish(component._id)} 
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-emerald-500/20 text-white/50 hover:text-emerald-400 transition-colors" 
                title="Publish"
              >
                <Rocket className="w-4 h-4" />
              </button>
            )}
            
            {component.status !== 'archived' && (
              <button 
                onClick={() => onArchive(component._id)} 
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-amber-500/20 text-white/50 hover:text-amber-400 transition-colors" 
                title="Archive"
              >
                <Archive className="w-4 h-4" />
              </button>
            )}
            
            <button 
              onClick={() => onDelete(component._id)} 
              className="p-2 rounded-lg bg-white/[0.03] hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors" 
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}