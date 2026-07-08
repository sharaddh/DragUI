import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Builder from "./pages/Builder";
import ProtectedRoute from "./middleware/ProtectedRoute";
import AuthSuccess from "./pages/AuthSuccess";
import CliLogin from "./pages/CliLogin";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ThemeEditor from "./pages/ThemeEditor";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import UserLayout from "./layouts/UserLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cli-login" element={<CliLogin />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth-success" element={<AuthSuccess />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserLayout>
                <Dashboard />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <UserLayout>
                <Projects />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/theme"
          element={
            <ProtectedRoute>
              <UserLayout>
                <ThemeEditor />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserLayout>
                <Profile />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <UserLayout>
                <Settings />
              </UserLayout>
            </ProtectedRoute>
          }
        />
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
