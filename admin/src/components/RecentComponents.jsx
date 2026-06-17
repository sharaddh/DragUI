import { MoreVertical, Box, Clock } from "lucide-react";

export default function RecentComponents({ items }) {
  return (
    <div className="relative h-full bg-[#0a0a0c]/80 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
      
      {/* Decorative top ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-[2px]" />

      <div className="flex justify-between items-end mb-8 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 mb-1">
            Recent Additions
          </h2>
          <p className="text-sm text-white/40 font-light">Your latest UI building blocks</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors bg-white/[0.03] hover:bg-white/[0.08] px-4 py-2 rounded-full border border-white/[0.05]">
          View All
        </button>
      </div>

      <div className="space-y-3 relative z-10">
        {items?.map((component, index) => (
          <div
            key={component._id || index}
            className="group relative flex justify-between items-center p-4 rounded-3xl bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.1] transition-all duration-500 overflow-hidden cursor-pointer"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-center gap-4">
              {/* Elegant Icon Box */}
              <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)] group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 rounded-t-2xl blur-[2px] opacity-30" />
                <Box className="w-5 h-5 text-white/80 group-hover:text-purple-300 transition-colors" />
              </div>
              
              <div>
                <h3 className="text-base font-semibold text-white/90 group-hover:text-white transition-colors">
                  {component.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-white/40 mt-1 font-light">
                  <Clock className="w-3 h-3" />
                  {/* Mocking a timestamp for the design—you can wire this to real data later */}
                  <span>Just now</span>
                </div>
              </div>
            </div>

            <div className="relative flex items-center gap-4">
              {/* Version Pill */}
              <div className="flex items-center justify-center px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 shadow-[inset_0_1px_5px_rgba(255,255,255,0.05)]">
                <span className="text-xs font-mono font-medium text-blue-300/80 group-hover:text-blue-300 transition-colors">
                  v{component.version}
                </span>
              </div>

              {/* Reveal-on-hover Action Menu */}
              <button className="p-2 rounded-xl text-white/30 hover:text-white/90 hover:bg-white/10 transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 duration-300">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {(!items || items.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-3xl bg-white/[0.01] border border-white/[0.02] border-dashed">
            <Box className="w-10 h-10 text-white/20 mb-3" />
            <p className="text-white/40 text-sm font-medium">No components pushed yet.</p>
            <p className="text-white/20 text-xs mt-1">They will appear here once created.</p>
          </div>
        )}
      </div>
    </div>
  );
}