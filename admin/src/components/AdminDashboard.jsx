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

const getComponentName = (code) => {
  if (!code) return "ComponentPreview";
  const matches = [
    code.match(/function\s+([A-Za-z0-9_]+)/),
    code.match(/const\s+([A-Za-z0-9_]+)\s*=/),
    code.match(/([A-Za-z0-9_]+)\s*=\s*\(.*?\)\s*=>/)
  ];
  return matches.find(m => m)?.[1] || "ComponentPreview";
};

const wrapPreviewCode = (code, files = []) => {
  let cleanCode = code?.trim() || "";
  if (!cleanCode) return "";

  // Replace any blob URLs with real Cloudinary URLs
  files.forEach((url, index) => {
    if (url && url.startsWith("http")) {
      cleanCode = cleanCode.replace(/blob:http[^"]*/g, url);
      cleanCode = cleanCode.replace(new RegExp(`"blob:[^"]*"`, 'g'), `"${url}"`);
    }
  });

  if (cleanCode.includes("render(")) return cleanCode;

  const name = getComponentName(cleanCode);
  cleanCode = cleanCode.replace(/\/\/ Asset Injection:[\s\S]*/g, "");

  return `${cleanCode}\n\nrender(<${name} />);`;
};

const AdminDashboard = ({ token, onLogout, apiSecret }) => {
  const [components, setComponents] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchComponents();
  }, [token]);

  const fetchComponents = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/components", {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "x-api-secret": apiSecret 
        }
      });
      setComponents(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to load components");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseBuilder = () => {
    setShowBuilder(false);
    setEditingComponent(null);
  };

  const handleEdit = (comp) => {
    setEditingComponent(comp);
    setShowBuilder(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this component permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/component/${id}`, {
        headers: { Authorization: `Bearer ${token}`, "x-api-secret": apiSecret }
      });
      setComponents(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filtered = components.filter(c =>
    (c.label || c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "All" || c.category === selectedCategory)
  );

  const categories = ["All", ...new Set(components.map(c => c.category).filter(Boolean))];

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>🚀 Component Studio</h1>
          <p>Professional UI Library Manager</p>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-content">
        {showBuilder ? (
          <ComponentBuilder
            token={token}
            apiSecret={apiSecret}
            initialData={editingComponent}
            onSuccess={() => {
              fetchComponents();
              handleCloseBuilder();
            }}
          />
        ) : (
          <div className="library-view">
            <div className="library-header">
              <h2>Components Library ({filtered.length})</h2>

              <div className="controls">
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />

                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="category-select">
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <div className="view-toggle">
                  <button onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "active" : ""}>Grid</button>
                  <button onClick={() => setViewMode("list")} className={viewMode === "list" ? "active" : ""}>List</button>
                </div>

                <button onClick={() => setShowBuilder(true)} className="new-btn">+ New Component</button>
              </div>
            </div>

            {isLoading ? (
              <div className="loading-state">Loading your components...</div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <h3>No components found</h3>
                <button onClick={() => setShowBuilder(true)} className="new-btn">Create New Component</button>
              </div>
            ) : (
              <div className={`components-grid ${viewMode}`}>
                {filtered.map((comp) => {
                  const sourceCode = comp.code || comp.template;
                  const files = comp.files || []; // Cloudinary URLs from DB

                  return (
                    <div key={comp._id} className="component-card">
                      <div className="preview-box">
                        {sourceCode ? (
                          <LiveProvider
                            code={wrapPreviewCode(sourceCode, files)}
                            scope={{ React }}
                            noInline
                          >
                            <LivePreview className="live-preview" />
                            <LiveError className="preview-error" />
                          </LiveProvider>
                        ) : (
                          <div className="no-preview">Preview Not Available</div>
                        )}
                      </div>

                      <div className="card-content">
                        <h3>{comp.label || comp.name}</h3>
                        <p className="desc">{comp.description ? comp.description.substring(0, 90) + "..." : "No description"}</p>

                        <div className="meta-info">
                          <span className="tag category">{comp.category || "Uncategorized"}</span>
                          {comp.props?.length > 0 && (
                            <span className="tag props">{comp.props.length} props</span>
                          )}
                        </div>

                        <div className="actions">
                          <button onClick={() => handleEdit(comp)} className="edit-btn">✏️ Edit</button>
                          <button onClick={() => handleDelete(comp._id)} className="delete-btn">🗑️ Delete</button>
                        </div>
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