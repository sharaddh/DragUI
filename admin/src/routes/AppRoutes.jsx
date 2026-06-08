import {
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/Login";

import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "../middleware/ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";
import Components from "../pages/Components";

export default function AppRoutes() {

  return (

    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>

            <AdminLayout>

              <Dashboard />

            </AdminLayout>

          </ProtectedRoute>
        }
      />

      <Route
        path="/components"
        element={
          <ProtectedRoute>

            <AdminLayout>

              <Components />

            </AdminLayout>

          </ProtectedRoute>
        }
      />

    </Routes>

  );

}