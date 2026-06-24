import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-sm">
            DU
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm font-medium text-slate-900">DropUI</p>
              <p className="text-xs text-slate-500">Visual builder toolkit</p>
            </div>
            <div className="hidden sm:flex items-center gap-4 ml-6">
              <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
                Dashboard
              </Link>
              <Link to="/projects" className="text-sm text-slate-600 hover:text-slate-900">
                Projects
              </Link>
              <Link to="/theme" className="text-sm text-slate-600 hover:text-slate-900">
                Theme
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}