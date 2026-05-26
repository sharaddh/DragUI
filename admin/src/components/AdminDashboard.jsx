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
        fetchComponents();
      } catch (err) {
        console.error("Error deleting component:", err);
        alert("Error deleting component: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🚀 Admin Dashboard</h1>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="admin-content">
        {showBuilder ? (
          <div className="builder-full-screen">
            <button
              onClick={() => setShowBuilder(false)}
              className="back-to-library-btn"
              title="Ctrl+Escape to go back"
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
          </div>
        ) : (
          <div className="library-view">
            <div className="library-header">
              <h2>📚 Components Library</h2>
              <button
                onClick={() => setShowBuilder(true)}
                className="create-btn"
              >
                + New Component
              </button>
            </div>

            {components.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No components yet</h3>
                <p>Create your first component to get started</p>
                <button
                  onClick={() => setShowBuilder(true)}
                  className="create-btn"
                >
                  Create First Component
                </button>
              </div>
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
                        <div className="preview-placeholder">No preview</div>
                      )}
                    </div>
                    <div className="component-info">
                      <h3>{component.label || component.name}</h3>
                      <div className="component-meta">
                        <span className="meta-tag">{component.category}</span>
                        {component.props && component.props.length > 0 && (
                          <span className="meta-tag">{component.props.length} props</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(component._id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
