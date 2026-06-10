import {
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/Login";

import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "../middleware/ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";
import Components from "../pages/Components";
import Marketplace
  from "../pages/Marketplace";
import ComponentEditor from "../pages/ComponentEditor";
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

      <Route
        path="/components/new"
        element={
          <ProtectedRoute>
            <ComponentEditor />
          </ProtectedRoute>
        }
      />

      <Route

        path="/marketplace"

        element={

          <ProtectedRoute>

            <AdminLayout>

              <Marketplace />

            </AdminLayout>

          </ProtectedRoute>

        }

      />
      <Route

        path="/ai-studio"

        element={

          <ProtectedRoute>

            <AdminLayout>

              <AIStudio />

            </AdminLayout>

          </ProtectedRoute>

        }

      />
      <Route
        path="/components/edit/:id"
        element={
          <ProtectedRoute>
            <ComponentEditor />
          </ProtectedRoute>
        }
      />
    </Routes>

  );

}