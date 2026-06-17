export default function RecentComponents({ items }) {
  return (
    <div className="h-full bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white/90">
          Recent Additions
        </h2>
        <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-2">
        {items?.map((component) => (
          <div
            key={component._id}
            className="group flex justify-between items-center p-3.5 rounded-2xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.05] transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/[0.05] group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors">
                <span className="text-xs font-bold text-white/70">{component.name.charAt(0)}</span>
              </div>
              <span className="font-medium text-white/80 group-hover:text-white transition-colors">
                {component.name}
              </span>
            </div>

            <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] text-xs text-white/50 border border-white/[0.03] font-mono">
              v{component.version}
            </span>
          </div>
        ))}

        {(!items || items.length === 0) && (
          <div className="text-center py-10 text-white/40 text-sm">
            No recent components found.
          </div>
        )}
      </div>
    </div>
  );
}