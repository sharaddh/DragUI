import { useEffect, useState } from "react";
import { Users, Boxes, Folder, Download } from "lucide-react";
import StatCard from "../components/StatCard";
import AnalyticsChart from "../components/AnalyticsChart";
import RecentComponents from "../components/RecentComponents";
import { getDashboardStats } from "../api/dashboardApi";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/10 border-t-white/80 rounded-full animate-spin" />
          <p className="text-white/50 text-sm tracking-widest uppercase">Loading Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-10 overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* --- Ambient Background Glows --- */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none mix-blend-screen" />

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        <header>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">
            Dashboard
          </h1>
          <p className="text-white/40 font-light">
            Overview of your platform's performance
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.stats.users}
            icon={<Users className="w-6 h-6 text-purple-400" />}
            trend="+12%"
          />
          <StatCard
            title="Components"
            value={stats.stats.components}
            icon={<Boxes className="w-6 h-6 text-blue-400" />}
            trend="+5%"
          />
          <StatCard
            title="Active Projects"
            value={stats.stats.projects}
            icon={<Folder className="w-6 h-6 text-emerald-400" />}
            trend="+18%"
          />
          <StatCard
            title="Downloads"
            value={stats.stats.downloads || 0}
            icon={<Download className="w-6 h-6 text-pink-400" />}
            trend="+24%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart
              data={[
                { name: "Jan", value: 30 },
                { name: "Feb", value: 60 },
                { name: "Mar", value: 100 },
                { name: "Apr", value: 85 },
                { name: "May", value: 140 },
              ]}
            />
          </div>
          <div className="lg:col-span-1">
            <RecentComponents items={stats.recentComponents} />
          </div>
        </div>

      </div>
    </div>
  );
}