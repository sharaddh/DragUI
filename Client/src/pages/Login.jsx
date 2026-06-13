import { useState, useContext } from "react";
import { loginAPI, googleLogin, githubLogin } from "../api/auth";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { 
  Mail, 
  Lock, 
  LogIn, 
  MailIcon,
  Loader2,
  AlertCircle
} from "lucide-react";
import Background from "../components/Background";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 EMAIL LOGIN / REGISTER
  const handleEmailLogin = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      const res = await loginAPI(form);
      login(res.data.token); // save token in context + localStorage
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEmailLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm p-8 z-1 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            DropUI
          </h1>
          <p className="text-gray-500 mt-2">Sign in / Sign up to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* EMAIL INPUT */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2" />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2" />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* REMEMBER ME & FORGOT PASSWORD */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
              Forgot password?
            </button>
          </div>

          {/* EMAIL LOGIN */}
          <button
            onClick={handleEmailLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600  hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <MailIcon className="w-5 h-5 mr-2" />
                Continue with Email
              </>
            )}
          </button>
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or continue with</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* GOOGLE LOGIN */}
          <button
            onClick={googleLogin}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          {/* GITHUB LOGIN */}
          <button
            onClick={githubLogin}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            <FaGithub className="w-5 h-5 mr-2" />
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing you are agreeing to our{" "}
          <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
            Privacy Policy.
          </button>
        </p>
      </div>
      <Background />
    </div>
  );
}   