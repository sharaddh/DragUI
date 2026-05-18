import React, { useState, useEffect } from "react";
import axios from "axios";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import ComponentBuilder from "./ComponentBuilder";
import "./AdminDashboard.css";

const getComponentName = (code) => {
  const functionMatch = code?.match(/function\s+([A-Za-z0-9_]+)/);
  const constMatch = code?.match(/const\s+([A-Za-z0-9_]+)\s*=\s*/);
  const arrowMatch = code?.match(/([A-Za-z0-9_]+)\s*=\s*\(.*\)\s*=>/);
  return (functionMatch || constMatch || arrowMatch)?.[1] || "ComponentPreview";
};

const wrapPreviewCode = (code) => {
  const trimmed = code?.trim();
  if (!trimmed) return "";
  if (trimmed.includes("render(")) return trimmed;
  const name = getComponentName(trimmed);
  return `${trimmed}\n\nrender(<${name} />);`;
};

const AdminDashboard = ({ token, onLogout }) => {
  const [components, setComponents] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);

  // Fetch components on mount
  useEffect(() => {
    fetchComponents();
  }, [token]);

  const fetchComponents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/components",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComponents(response.data);
    } catch (err) {
      console.error("Error fetching components:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/component/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Component deleted successfully!");
        fetchComponents();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Error deleting component");
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="admin-content">
        {!showBuilder ? (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowBuilder(true)}
                className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600"
              >
                + Create New Component
              </button>
            </div>

            <div className="components-list-section">
              <h2>Components Library ({components.length})</h2>

              {components.length === 0 ? (
                <p className="no-components">No components created yet</p>
              ) : (
                <div className="components-grid">
                  {components.map((component) => (
                    <div key={component._id} className="component-card">
                      <div className="component-preview">
                        {component.code ? (
                          <LiveProvider code={wrapPreviewCode(component.code)} scope={{ React }} noInline>
                            <div className="preview-container">
                              <LivePreview />
                              <LiveError className="preview-error" />
                            </div>
                          </LiveProvider>
                        ) : (
                          <div className="preview-placeholder">No preview available</div>
                        )}
                      </div>
                      <h3>{component.label || component.name}</h3>
                      <p>
                        <strong>Type:</strong> {component.type}
                      </p>
                      <p>
                        <strong>Category:</strong> {component.category}
                      </p>
                      {component.props && component.props.length > 0 && (
                        <p>
                          <strong>Props:</strong> {component.props.length}
                        </p>
                      )}
                      <button
                        onClick={() => handleDelete(component._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowBuilder(false)}
              className="mb-6 px-6 py-3 bg-slate-500 text-white rounded-lg font-semibold hover:bg-slate-600"
            >
              ← Back to Library
            </button>

            <ComponentBuilder
              token={token}
              onSuccess={() => {
                fetchComponents();
                setShowBuilder(false);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
