import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const auth = useContext(AuthContext) || {};
  const { token } = auth;
  const location = useLocation();

  if (!token) {
    sessionStorage.setItem("dropui.returnTo", location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  return children;
}