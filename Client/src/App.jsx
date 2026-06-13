import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Builder from "./pages/Builder";
import ProtectedRoute from "./middleware/ProtectedRoute";
import AuthSuccess from "./pages/AuthSuccess";
import Dashboard from "./pages/Dashboard";
import CliLogin from "./pages/CliLogin2";
import CliLogin from "./pages/CliLogin889";
import CliLogin from "./pages/CliLogin52";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cli-login" element={<CliLogin />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route
          path="/builder"
          element={
            <ProtectedRoute>
              <Builder />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}