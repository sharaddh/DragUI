import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const auth = useContext(AuthContext) || {};
  const { token } = auth;

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
