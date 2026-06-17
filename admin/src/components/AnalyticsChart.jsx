import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

// Custom Tooltip for Glassmorphism
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f0f13]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-white/60 text-sm mb-1">{label}</p>
        <p className="text-white font-bold text-xl">
          {payload[0].value} <span className="text-white/40 text-sm font-normal">units</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart({ data }) {
  return (
    <div className="h-full bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-semibold text-white/90">
          Growth Analytics
        </h2>
        <div className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.05] text-xs text-white/60">
          This Year
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.2)" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            
            <YAxis 
              stroke="rgba(255,255,255,0.2)" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}