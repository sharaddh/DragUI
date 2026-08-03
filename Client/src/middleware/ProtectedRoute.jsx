import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const auth = useContext(AuthContext) || {};
  const { token } = auth;

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}