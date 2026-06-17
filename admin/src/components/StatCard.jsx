export default function StatCard({ title, value, icon, trend }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_0_rgba(0,0,0,0.5)]">
      
      {/* Subtle top glare */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <p className="text-sm font-medium text-white/40 tracking-wide">
            {title}
          </p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-bold text-white">
              {value}
            </h2>
            {trend && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                {trend}
              </span>
            )}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/[0.05] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
    </div>
  );
}