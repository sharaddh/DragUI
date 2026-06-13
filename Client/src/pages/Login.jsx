import { useState, useContext } from "react";
import { loginAPI, googleLogin, githubLogin } from "../api/auth";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { Mail, Lock, LogIn, Loader2, AlertCircle, Github } from "lucide-react";
import Background from "../components/Background";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Clear error when user starts typing
  const clearError = () => error && setError("");

  const validateForm = () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleEmailLogin = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await loginAPI(form);
      // Ensure token exists before proceeding
      if (res.data?.token) {
        login(res.data.token);
        navigate("/dash   