import { useAuth } from "../context/AuthContext";
import { Search, Bell, LogOut, Shield } from "lucide-react";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-24 px-8 flex justify-between items-center bg-[#050505]/60 backdrop-blur-2xl border-b border-white/[0.08] sticky top-0 z-30 font-sans">
      
      {/* --- Left: Global Search --- */}
      <div className="flex-1 max-w-md relative group hidden md:block">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-white/40 group-focus-within:text-purple-400 transition-colors duration-300" />
        </div>
        <input
          type="text"
          placeholder="Search components, projects, or settings..."
          className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/[0.06] focus:border-purple-500/30 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
        />
        {/* Shortcut Hint */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono text-white/40 bg-white/[0.05] border border-white/[0.1]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* --- Right: Actions & Profile --- */}
      <div className="flex items-center gap-5 ml-auto">
        
        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:scale-105 active:scale-95 transition-all text-white/60 hover:text-white">
          <Bell className="w-5 h-5" />
          {/* Unread Indicator */}
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-purple-500 border-2 border-[#050505]"></span>
        </button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-white/[0.15] to-transparent" />

        {/* Profile Info */}
        <div className="flex items-center gap-3 pl-2">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-white/90 tracking-wide">
              {user?.adminId || "Admin"}
            </span>
            <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              System Online
            </span>
          </div>
          
          {/* Avatar Icon */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600/20 to-blue-500/20 border border-white/[0.15] flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer hover:border-purple-500/40 transition-colors">
            <Shield className="w-5 h-5 text-white/80" />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="ml-2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/50 border border-transparent hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 group"
          title="Logout"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline-block">Logout</span>
        </button>
        
      </div>
    </header>
  );
}