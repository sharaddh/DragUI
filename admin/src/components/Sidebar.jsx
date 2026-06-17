import {
  LayoutDashboard,
  Boxes,
  Sparkles,
  Users,
  Store,
  LogOut
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  // Organizing navigation items makes the component much cleaner
  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Components", path: "/components", icon: <Boxes className="w-5 h-5" /> },
    { name: "AI Studio", path: "/ai-studio", icon: <Sparkles className="w-5 h-5" /> },
    { name: "Marketplace", path: "/marketplace", icon: <Store className="w-5 h-5" /> },
    { name: "Collaboration", path: "/collaboration", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-72 min-h-screen bg-[#050505]/60 backdrop-blur-3xl border-r border-white/[0.08] flex flex-col font-sans relative z-20">
      
      {/* --- Logo Area --- */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">
            DropUI
          </h1>
        </div>
      </div>

      {/* --- Navigation Links --- */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium group ${
                isActive
                  ? "bg-white/[0.08] text-white border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                  : "text-white/50 hover:text-white/90 hover:bg-white/[0.03] border border-transparent"
              }`
            }
          >
            {/* Wrapper to add a subtle glow to the icon when active/hovered */}
            <div className="transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
              {item.icon}
            </div>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* --- Bottom Profile / Settings Area --- */}
      <div className="p-4 mt-auto">
        <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between group hover:bg-white/[0.04] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
              <span className="text-sm font-bold text-white/80">AD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">Admin</p>
              <p className="text-xs text-white/40">Workspace</p>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-white/30 group-hover:text-red-400 transition-colors" />
        </div>
      </div>

    </aside>
  );
}