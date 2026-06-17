import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ adminId: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.adminId || !form.password) {
      toast.error("Please fill in all fields", {
        style: { background: '#333', color: '#fff', borderRadius: '12px' }
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await login(form.adminId, form.password);
      toast.success("Authentication successful", {
        style: { background: '#333', color: '#fff', borderRadius: '12px' }
      });
      navigate("/");
    } catch {
      toast.error("Invalid credentials", {
        style: { background: '#333', color: '#fff', borderRadius: '12px' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* --- Ambient Background Glows --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[150px] pointer-events-none mix-blend-screen" />

      {/* --- Glassmorphism Card --- */}
      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-md p-10 mx-4 rounded-[2rem] bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
      >
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/20 mb-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {/* Elegant Icon */}
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight mb-2">
            DropUI Admin
          </h1>
          <p className="text-sm text-white/40 font-light">
            Secure access to your dashboard
          </p>
        </div>

        <div className="space-y-6">
          {/* Admin ID Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-white/40 group-focus-within:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="adminId"
              name="adminId"
              type="text"
              required
              placeholder="Admin ID"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.05] text-white placeholder-white/30 focus:outline-none focus:bg-white/[0.08] focus:border-white/20 focus:ring-4 focus:ring-white/[0.05] transition-all duration-300 backdrop-blur-sm"
              value={form.adminId}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-white/40 group-focus-within:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.05] text-white placeholder-white/30 focus:outline-none focus:bg-white/[0.08] focus:border-white/20 focus:ring-4 focus:ring-white/[0.05] transition-all duration-300 backdrop-blur-sm"
              value={form.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full mt-10 py-3.5 rounded-2xl bg-white text-black font-semibold overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        >
          {/* Subtle button glare effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          
          <span className="relative flex justify-center items-center gap-2">
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </span>
        </button>
      </form>
    </div>
  );
}