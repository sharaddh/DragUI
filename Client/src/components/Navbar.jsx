import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function Navbar() {
  const auth = useContext(AuthContext) || {};
  const { logout } = auth;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-400 items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-sm shadow-cyan-500/20">
            DU
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">DropUI</p>
            <p className="text-xs text-slate-500">Visual builder toolkit</p>
          </div>
        </div>

        <button
          onClick={logout ?? (() => {})}
          disabled={!logout}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}