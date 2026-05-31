// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { LiveProvider, LivePreview, LiveError } from "react-live";
// import ComponentBuilder from "./ComponentBuilder";
// import "./AdminDashboard.css";

// const getComponentName = (code) => {
//   const functionMatch = code?.match(/function\s+([A-Za-z0-9_]+)/);
//   const constMatch = code?.match(/const\s+([A-Za-z0-9_]+)\s*=\s*/);
//   const arrowMatch = code?.match(/([A-Za-z0-9_]+)\s*=\s*\(.*\)\s*=>/);
//   return (functionMatch || constMatch || arrowMatch)?.[1] || "ComponentPreview";
// };

// const wrapPreviewCode = (code) => {
//   const trimmed = code?.trim();
//   if (!trimmed) return "";
//   if (trimmed.includes("render(")) return trimmed;
//   const name = getComponentName(trimmed);
//   return `${trimmed}\n\nrender(<${name} />);`;
// };

// const AdminDashboard = ({ token, onLogout }) => {
//   const [components, setComponents] = useState([]);
//   const [showBuilder, setShowBuilder] = useState(false);

//   // Fetch components on mount
//   useEffect(() => {
//     fetchComponents();
//   }, [token]);

//   const fetchComponents = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:5000/api/admin/components",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setComponents(response.data);
//     } catch (err) {
//       console.error("Error fetching components:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this component?")) {
//       try {
//         await axios.delete(`http://localhost:5000/api/admin/component/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         fetchComponents();
//       } catch (err) {
//         console.error("Error deleting component:", err);
//         alert("Error deleting component: " + (err.response?.data?.message || err.message));
//       }
//     }
//   };

//   return (
//     <div className="admin-dashboard">
//       <header className="admin-header">
//         <h1>🚀 Admin Dashboard</h1>
//         <button onClick={onLogout} className="logout-btn">
//           Logout
//         </button>
//       </header>

//       <div className="admin-content">
//         {showBuilder ? (
//           <div className="builder-full-screen">
//             <button
//               onClick={() => setShowBuilder(false)}
//               className="back-to-library-btn"
//               title="Ctrl+Escape to go back"
//             >
//               ← Back to Library
//             </button>
//             <ComponentBuilder
//               token={token}
//               onSuccess={() => {
//                 fetchComponents();
//                 setShowBuilder(false);
//               }}
//             />
//           </div>
//         ) : (
//           <div className="library-view">
//             <div className="library-header">
//               <h2>📚 Components Library</h2>
//               <button
//                 onClick={() => setShowBuilder(true)}
//                 className="create-btn"
//               >
//                 + New Component
//               </button>
//             </div>

//             {components.length === 0 ? (
//               <div className="empty-state">
//                 <div className="empty-icon">📦</div>
//                 <h3>No components yet</h3>
//                 <p>Create your first component to get started</p>
//                 <button
//                   onClick={() => setShowBuilder(true)}
//                   className="create-btn"
//                 >
//                   Create First Component
//                 </button>
//               </div>
//             ) : (
//               <div className="components-grid">
//                 {components.map((component) => (
//                   <div key={component._id} className="component-card">
//                     <div className="component-preview">
//                       {component.code ? (
//                         <LiveProvider code={wrapPreviewCode(component.code)} scope={{ React }} noInline>
//                           <div className="preview-container">
//                             <LivePreview />
//                             <LiveError className="preview-error" />
//                           </div>
//                         </LiveProvider>
//                       ) : (
//                         <div className="preview-placeholder">No preview</div>
//                       )}
//                     </div>
//                     <div className="component-info">
//                       <h3>{component.label || component.name}</h3>
//                       <div className="component-meta">
//                         <span className="meta-tag">{component.category}</span>
//                         {component.props && component.props.length > 0 && (
//                           <span className="meta-tag">{component.props.length} props</span>
//                         )}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => handleDelete(component._id)}
//                       className="delete-btn"
//                     >
//                       🗑️ Delete
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import ComponentBuilder from "./ComponentBuilder";
import "./AdminDashboard.css";

// Improved regex to safely extract the component name
const getComponentName = (code) => {
  if (!code) return "ComponentPreview";
  const functionMatch = code.match(/function\s+([A-Za-z0-9_]+)/);
  const constMatch = code.match(/const\s+([A-Za-z0-9_]+)\s*=\s*/);
  const arrowMatch = code.match(/([A-Za-z0-9_]+)\s*=\s*\(.*\)\s*=>/);
  return (functionMatch || constMatch || arrowMatch)?.[1] || "ComponentPreview";
};

// Safely wrap the code for react-live rendering
const wrapPreviewCode = (code) => {
  const trimmed = code?.trim();
  if (!trimmed) return "";
  // If render is already explicitly called, just return the code
  if (trimmed.includes("render(")) return trimmed;
  
  const name = getComponentName(trimmed);
  // Remove any asset injection comments that might break the raw render
  const cleanCode = trimmed.replace(/\/\/ Asset Injection:[\s\S]*/, "");
  return `${cleanCode}\n\nrender(<${name} />);`;
};

const AdminDashboard = ({ token, onLogout }) => {
  const [components, setComponents] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch components on mount
  useEffect(() => {
    fetchComponents();
  }, [token]);

  // Global Keyboard Shortcuts (Escape to exit builder)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showBuilder) {
        setShowBuilder(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showBuilder]);

  const fetchComponents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/components",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Sort components newest first (assuming _id or createdAt exists)
      const sorted = response.data.sort((a, b) => 
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setComponents(sorted);
    } catch (err) {
      console.error("Error fetching components:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this component? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/component/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Optimistic UI update for faster feeling interface
        setComponents(prev => prev.filter(c => c._id !== id));
      } catch (err) {
        console.error("Error deleting component:", err);
        alert("Error deleting component: " + (err.response?.data?.message || err.message));
        fetchComponents(); // Re-fetch to ensure sync if delete failed halfway
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
              title="Press Esc to go back"
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

            {isLoading ? (
              <div className="empty-state">
                <div className="loading-spinner">⏳ Loading components...</div>
              </div>
            ) : components.length === 0 ? (
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
                {components.map((component) => {
                  // Accommodate schema differences (code vs template)
                  const sourceCode = component.template || component.code;

                  return (
                    <div key={component._id} className="component-card">
                      <div className="component-preview">
                        {sourceCode ? (
                          <div className="live-preview-wrapper" style={{ height: "150px", overflow: "hidden", position: "relative" }}>
                            <LiveProvider code={wrapPreviewCode(sourceCode)} scope={{ React }} noInline>
                              <div className="preview-container" style={{ transform: "scale(0.8)", transformOrigin: "top left", width: "125%", height: "125%" }}>
                                <LivePreview />
                              </div>
                              <LiveError className="preview-error" style={{ position: "absolute", bottom: 0, left: 0, right: 0, fontSize: "10px", padding: "4px" }} />
                            </LiveProvider>
                          </div>
                        ) : (
                          <div className="preview-placeholder">No valid code found</div>
                        )}
                      </div>
                      <div className="component-info">
                        <h3>{component.label || component.name}</h3>
                        <div className="component-meta">
                          <span className="meta-tag category-tag">{component.category || "Uncategorized"}</span>
                          {component.props && Array.isArray(component.props) && component.props.length > 0 && (
                            <span className="meta-tag props-tag">{component.props.length} props</span>
                          )}
                        </div>
                      </div>
                      <div className="component-actions">
                        <button
                          onClick={() => handleDelete(component._id)}
                          className="delete-btn"
                          title="Delete Component"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;