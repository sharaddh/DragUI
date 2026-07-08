import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Menu, X, LayoutDashboard, Box, Palette } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-sm">
            DU
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">DropUI</p>
            <p className="text-xs text-slate-500">Visual builder toolkit</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          <Link to="/dashboard" className="rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <LayoutDashboard className="h-4 w-4 inline mr-1" />
            Dashboard
          </Link>
          <Link to="/projects" className="rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <Box className="h-4 w-4 inline mr-1" />
            Projects
          </Link>
          <Link to="/theme" className="rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <Palette className="h-4 w-4 inline mr-1" />
            Theme
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">
                {user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="hidden sm:inline text-sm text-slate-700 truncate max-w-[120px]">
                {user.email || "User"}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 sm:hidden animate-fadeIn">
          <div className="flex flex-col gap-1">
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
              Dashboard
            </Link>
            <Link to="/projects" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
              Projects
            </Link>
            <Link to="/theme" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
              Theme
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
