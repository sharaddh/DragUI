import { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export default function AuthSuccess() {
  const auth = useContext(AuthContext) || {};
  const { login } = auth;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token) {
      login?.(token); // 🔥 THIS SAVES TOKEN
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="p-10">Logging you in...</div>;
}