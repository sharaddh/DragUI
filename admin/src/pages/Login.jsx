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
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      await login(form.adminId, form.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch {
      toast.error("Invalid Credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4 font-sans text-zinc-100 selection:bg-white/30">
      
      {/* Decorative background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

      <form
        onSubmit={submit}
        className="relative z-10 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-8 sm:p-10 rounded-3xl w-full max-w-md shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            DropUI Admin
          </h1>
          <p className="text-sm text-zinc-400">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label 
              htmlFor="adminId" 
              className="block text-sm font-medium text-zinc-300 mb-1.5"
            >
              Admin ID
            </label>
            <input
              id="adminId"
              name="adminId"
              type="text"
              required
              placeholder="e.g. admin_123"
              className="w-full p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all duration-200"
              value={form.adminId}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-zinc-300 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all duration-200"
              value={form.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-8 bg-white text-black font-semibold p-3.5 rounded-xl hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-200 flex justify-center items-center gap-2"
        >
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
        </button>
      </form>
    </div>
  );
}