import { useState, useContext } from "react";
import { loginAPI, googleLogin, githubLogin } from "../api/auth";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import {
  Mail, Lock, LogIn, Loader2, AlertCircle, Eye, EyeOff
} from "lucide-react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Please enter both email and password");
      return;
    }
    setIsLoading(true);
    try {
      const res = await loginAPI(form);
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleEmailLogin();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 p-4">
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative w-full max-w-md animate-fadeIn">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">DropUI</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onKeyDown={handleKeyPress}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyDown={handleKeyPress}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <button className="font-medium text-cyan-600 transition hover:text-cyan-700">
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleEmailLogin}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-600 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Continue with Email
                </>
              )}
            </button>
          </div>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-slate-200" />
            <span className="text-xs text-slate-400">or continue with</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={googleLogin}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button
              onClick={githubLogin}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
            >
              <FaGithub className="h-5 w-5 shrink-0" />
              GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to our{" "}
            <button className="font-medium text-cyan-600 transition hover:text-cyan-700">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
