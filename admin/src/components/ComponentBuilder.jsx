// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
// import "./ComponentBuilder.css";

// const defaultCode = `function ComponentPreview({ title = "Component title", description = "A live preview of your component." }) {
//   return (
//     <div style={{ padding: 24, borderRadius: 24, background: "#eff6ff", color: "#0f172a", border: "1px solid #c7d2fe" }}>
//       <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
//       <p style={{ margin: "12px 0 0", color: "#475569" }}>{description}</p>
//     </div>
//   );
// }`;

// const defaultPreviewCode = `${defaultCode}\n\nrender(<ComponentPreview />);`;

// function getComponentName(code) {
//   const functionMatch = code.match(/function\s+([A-Za-z0-9_]+)/);
//   const constMatch = code.match(/const\s+([A-Za-z0-9_]+)\s*=\s*/);
//   const arrowMatch = code.match(/([A-Za-z0-9_]+)\s*=\s*\(.*\)\s*=>/);
//   return (functionMatch || constMatch || arrowMatch)?.[1] || "ComponentPreview";
// }

// function getPreviewCode(code) {
//   const trimmed = code?.trim();
//   if (!trimmed) return defaultPreviewCode;
//   if (trimmed.includes("render(")) return trimmed;
//   const name = getComponentName(trimmed);
//   return `${trimmed}\n\nrender(<${name} />);`;
// }

// export default function ComponentBuilder({ token, onSuccess }) {
//   const [step, setStep] = useState("basic");
//   const [formData, setFormData] = useState({
//     name: "",
//     label: "",
//     category: "",
//     description: "",
//     code: defaultCode,
//     installSteps: "",
//     props: [],
//   });

//   const [currentProp, setCurrentProp] = useState({
//     name: "",
//     label: "",
//     type: "text",
//     default: "",
//     options: [],
//   });

//   const [showShortcuts, setShowShortcuts] = useState(false);
//   const [isSaved, setIsSaved] = useState(true);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [aiPrompt, setAiPrompt] = useState("");
//   const [showAIGenerator, setShowAIGenerator] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState([]);

//   useEffect(() => {
//     // revoke object URLs on unmount
//     return () => {
//       selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
//     };
//   }, [selectedFiles]);

//   // Keyboard shortcuts handler
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       // Ctrl/Cmd + S - Save
//       if ((e.ctrlKey || e.metaKey) && e.key === "s") {
//         e.preventDefault();
//         setIsSaved(true);
//       }
//       // Ctrl/Cmd + K - Show shortcuts
//       if ((e.ctrlKey || e.metaKey) && e.key === "k") {
//         e.preventDefault();
//         setShowShortcuts(!showShortcuts);
//       }
//       // Ctrl/Cmd + Enter - Submit
//       if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
//         e.preventDefault();
//         if (step === "review") {
//           handleSubmit();
//         }
//       }
//       // Arrow keys to navigate steps
//       if (e.key === "ArrowRight" && e.ctrlKey) {
//         e.preventDefault();
//         const steps = ["basic", "code", "props", "review"];
//         const currentIndex = steps.indexOf(step);
//         if (currentIndex < steps.length - 1) {
//           setStep(steps[currentIndex + 1]);
//         }
//       }
//       if (e.key === "ArrowLeft" && e.ctrlKey) {
//         e.preventDefault();
//         const steps = ["basic", "code", "props", "review"];
//         const currentIndex = steps.indexOf(step);
//         if (currentIndex > 0) {
//           setStep(steps[currentIndex - 1]);
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [step, showShortcuts]);

//   const handleBasicChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setIsSaved(false);
//   };

//   const handleCodeChange = (code) => {
//     setFormData(prev => ({ ...prev, code }));
//     extractPropsFromCode(code);
//     setIsSaved(false);
//   };

//   const handleAIFix = async () => {
//     try {
//       setAiLoading(true);
//       const response = await axios.post(
//         "http://localhost:5000/api/admin/components/ai/fix",
//         { code: formData.code },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (response.data?.code) {
//         setFormData((prev) => ({ ...prev, code: response.data.code }));
//         extractPropsFromCode(response.data.code);
//         setIsSaved(false);
//         alert("AI: Code updated from suggestion.");
//       }
//     } catch (err) {
//       alert("AI fix failed: " + (err.response?.data?.message || err.message));
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const handleAIGenerate = async () => {
//     try {
//       if (!aiPrompt.trim()) return alert("Enter a text prompt describing the component.");
//       setAiLoading(true);
//       const response = await axios.post(
//         "http://localhost:5000/api/admin/components/ai/generate",
//         { prompt: aiPrompt },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (response.data?.code) {
//         setFormData((prev) => ({ ...prev, code: response.data.code }));
//         extractPropsFromCode(response.data.code);
//         setIsSaved(false);
//         setShowAIGenerator(false);
//         alert("AI: Generated component code inserted into the editor.");
//       }
//     } catch (err) {
//       alert("AI generate failed: " + (err.response?.data?.message || err.message));
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const extractPropsFromCode = (code) => {
//     // Simple regex to find props in function signature
//     const match = code.match(/function\s+\w+\s*\(\s*\{\s*([^}]*)\s*\}\s*\)/);
//     if (match) {
//       const propsStr = match[1];
//       const props = propsStr.split(',').map(p => p.trim()).filter(p => p);
//       const extractedProps = props.map(prop => ({
//         name: prop,
//         label: prop.charAt(0).toUpperCase() + prop.slice(1),
//         type: "text",
//         default: "",
//         options: [],
//       }));
//       setFormData(prev => ({ ...prev, props: extractedProps }));
//     }
//   };

//   const handleInstallChange = (e) => {
//     setFormData(prev => ({ ...prev, installSteps: e.target.value }));
//     setIsSaved(false);
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files || []);
//     const withPreview = files.map((f) => ({ file: f, preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null }));
//     setSelectedFiles((prev) => [...prev, ...withPreview]);
//     setIsSaved(false);
//   };

//   const removeFile = (index) => {
//     const toRemove = selectedFiles[index];
//     if (toRemove && toRemove.preview) URL.revokeObjectURL(toRemove.preview);
//     setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
//     setIsSaved(false);
//   };

//   const addProp = () => {
//     if (!currentProp.name) {
//       alert("Prop name is required");
//       return;
//     }

//     setFormData(prev => ({
//       ...prev,
//       props: [...prev.props, { ...currentProp }],
//     }));

//     setCurrentProp({
//       name: "",
//       label: "",
//       type: "text",
//       default: "",
//       options: [],
//     });
//     setIsSaved(false);
//   };

//   const removeProp = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       props: prev.props.filter((_, i) => i !== index),
//     }));
//     setIsSaved(false);
//   };

//   const handleSubmit = async (e) => {
//     if (e && e.preventDefault) e.preventDefault();

//     try {
//       // Only send allowed fields
//       const { name, label, category, description, code, installSteps, props } = formData;
//       // If files/assets were selected, use legacy multipart upload endpoint which also saves files
//       if (selectedFiles.length > 0) {
//         const fd = new FormData();
//         fd.append("name", name);
//         fd.append("type", "frontend");
//         fd.append("category", category);
//         // props as comma separated names
//         if (props && props.length) fd.append("props", props.map(p => p.name).join(","));
//         selectedFiles.forEach((p) => fd.append("files", p.file));

//         await axios.post("http://localhost:5000/api/admin/component", fd, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       } else {
//         const payload = { name, label, category, description, template: code, installSteps, props };
//         await axios.post("http://localhost:5000/api/admin/components/create", payload, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }

//       alert("Component created successfully!");
//       setFormData({
//         name: "",
//         label: "",
//         category: "",
//         description: "",
//         code: defaultCode,
//         installSteps: "",
//         props: [],
//       });
//       // cleanup file previews
//       selectedFiles.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
//       setSelectedFiles([]);
//       setStep("basic");
//       onSuccess?.();
//     } catch (err) {
//       alert("Error creating component: " + err.message);
//     }
//   };

//   return (
//     <div className="vscode-container">
//       {/* Activity Bar & Sidebar */}
//       <div className="vscode-left">
//         <div className="activity-bar">
//           <div className="activity-icon active" title="Component Builder">
//             <span>🔨</span>
//           </div>
//           <div className="activity-icon" title="Settings">
//             <span>⚙️</span>
//           </div>
//           <div className="activity-icon" title="Help">
//             <span>❓</span>
//           </div>
//         </div>

//         <div className="sidebar">
//           <div className="sidebar-header">Component Builder</div>
//           <nav className="steps-nav">
//             {[
//               { id: "basic", label: "Basic Info", icon: "📝" },
//               { id: "code", label: "Code Editor", icon: "💻" },
//               { id: "props", label: "Props", icon: "🎛️" },
//               { id: "review", label: "Review", icon: "✅" },
//             ].map((s) => (
//               <div
//                 key={s.id}
//                 onClick={() => setStep(s.id)}
//                 className={`step-item ${step === s.id ? "active" : ""}`}
//               >
//                 <span className="step-icon">{s.icon}</span>
//                 <span className="step-label">{s.label}</span>
//                 {step === s.id && <div className="active-indicator"></div>}
//               </div>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Main Editor Area */}
//       <div className="vscode-main">
//         {/* Editor Tabs */}
//         <div className="editor-tabs">
//           <div className="tab active">
//             <span>⚪ component.jsx</span>
//             {!isSaved && <span className="unsaved-dot">●</span>}
//           </div>
//         </div>

//         {/* Breadcrumb */}
//         <div className="breadcrumb">
//           <span className="breadcrumb-item">Admin</span>
//           <span className="breadcrumb-separator">/</span>
//           <span className="breadcrumb-item">Components</span>
//           <span className="breadcrumb-separator">/</span>
//           <span className="breadcrumb-item active">{step.toUpperCase()}</span>
//         </div>

//         {/* Shortcuts Modal */}
//         {showShortcuts && (
//           <div className="shortcuts-modal">
//             <div className="shortcuts-content">
//               <button
//                 className="close-btn"
//                 onClick={() => setShowShortcuts(false)}
//               >
//                 ✕
//               </button>
//               <h2>Keyboard Shortcuts</h2>
//               <div className="shortcuts-list">
//                 <div className="shortcut-item">
//                   <span className="shortcut-key">Ctrl+K</span>
//                   <span className="shortcut-desc">Toggle Shortcuts</span>
//                 </div>
//                 <div className="shortcut-item">
//                   <span className="shortcut-key">Ctrl+→</span>
//                   <span className="shortcut-desc">Next Step</span>
//                 </div>
//                 <div className="shortcut-item">
//                   <span className="shortcut-key">Ctrl+←</span>
//                   <span className="shortcut-desc">Previous Step</span>
//                 </div>
//                 <div className="shortcut-item">
//                   <span className="shortcut-key">Ctrl+Enter</span>
//                   <span className="shortcut-desc">Submit</span>
//                 </div>
//                 <div className="shortcut-item">
//                   <span className="shortcut-key">Ctrl+S</span>
//                   <span className="shortcut-desc">Mark as Saved</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="editor-content">
//           <form onSubmit={handleSubmit} className="form-container">
//             {/* BASIC INFO STEP */}
//             {step === "basic" && (
//               <div className="step-section">
//                 <h2 className="step-title">📝 Basic Information</h2>
//                 <p className="step-description">Define your component's basic details</p>

//                 <div className="form-group">
//                   <label className="form-label">
//                     Component Name
//                     <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleBasicChange}
//                     placeholder="e.g., Card, Button, Hero"
//                     className="form-input"
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">
//                     Display Label
//                     <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="label"
//                     value={formData.label}
//                     onChange={handleBasicChange}
//                     placeholder="e.g., Card Component"
//                     className="form-input"
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">
//                     Category
//                     <span className="required">*</span>
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleBasicChange}
//                     className="form-input"
//                   >
//                     <option value="">Select category</option>
//                     <option value="Layout">Layout</option>
//                     <option value="Typography">Typography</option>
//                     <option value="Forms">Forms</option>
//                     <option value="Navigation">Navigation</option>
//                     <option value="Cards">Cards</option>
//                     <option value="Buttons">Buttons</option>
//                     <option value="Media">Media</option>
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">
//                     Description
//                     <span className="required">*</span>
//                   </label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleBasicChange}
//                     placeholder="Describe what this component does..."
//                     rows="4"
//                     className="form-input"
//                   ></textarea>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Assets (images, video, other files)</label>
//                   <input type="file" multiple onChange={handleFileChange} className="form-input" />
//                   {selectedFiles.length > 0 && (
//                     <div className="mt-2 grid grid-cols-4 gap-2">
//                       {selectedFiles.map((f, idx) => (
//                         <div key={idx} className="relative rounded-lg border p-1 text-xs">
//                           {f.preview ? (
//                             <img src={f.preview} alt={f.file.name} className="h-20 w-full object-cover rounded" />
//                           ) : (
//                             <div className="flex h-20 items-center justify-center text-[11px]">{f.file.name}</div>
//                           )}
//                           <button type="button" onClick={() => removeFile(idx)} className="absolute top-1 right-1 rounded-full bg-white p-1 text-xs">✕</button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* CODE EDITOR STEP */}
//             {step === "code" && (
//               <div className="step-section">
//                 <h2 className="step-title">💻 Component Code</h2>
//                 <p className="step-description">Write your JSX component with live preview</p>

//                 <LiveProvider code={getPreviewCode(formData.code)} scope={{ React }} noInline>
//                   <div className="code-editor-grid">
//                     <div className="editor-wrapper">
//                       <div className="editor-header">
//                         <div className="flex items-center gap-3">
//                           <span className="editor-label">Editor</span>
//                           <span className="file-name">component.jsx</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <button type="button" onClick={handleAIFix} disabled={aiLoading} className="btn btn-secondary">{aiLoading ? 'Running AI...' : 'AI Fix Code'}</button>
//                           <button type="button" onClick={() => setShowAIGenerator(true)} className="btn btn-outline">Generate from text</button>
//                         </div>
//                       </div>
//                       <LiveEditor
//                         code={formData.code}
//                         onChange={handleCodeChange}
//                         className="live-editor"
//                         style={{ minHeight: "400px" }}
//                       />
//                       <LiveError className="editor-error" />
//                     </div>

//                     <div className="preview-wrapper">
//                       <div className="preview-header">
//                         <span className="preview-label">Live Preview</span>
//                       </div>
//                       <div className="preview-render">
//                         <LivePreview />
//                       </div>
//                     </div>
//                   </div>
//                 </LiveProvider>

//                 {showAIGenerator && (
//                   <div className="ai-generator-modal">
//                     <div className="ai-generator-card">
//                       <div className="flex items-center justify-between">
//                         <h3>AI Component Generator</h3>
//                         <button onClick={() => setShowAIGenerator(false)}>✕</button>
//                       </div>
//                       <textarea
//                         value={aiPrompt}
//                         onChange={(e) => setAiPrompt(e.target.value)}
//                         placeholder="Describe the component you want (layout, props, behavior, styles)..."
//                         rows={6}
//                         className="form-input"
//                       />
//                       <div className="flex items-center gap-2">
//                         <button onClick={handleAIGenerate} disabled={aiLoading} className="btn btn-primary">{aiLoading ? 'Generating...' : 'Generate'}</button>
//                         <button onClick={() => setShowAIGenerator(false)} className="btn btn-secondary">Cancel</button>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="form-group" style={{ marginTop: "20px" }}>
//                   <label className="form-label">Installation Steps (Optional)</label>
//                   <textarea
//                     value={formData.installSteps}
//                     onChange={handleInstallChange}
//                     placeholder="npm install tailwindcss&#10;npm install @heroicons/react"
//                     rows="5"
//                     className="form-input"
//                   ></textarea>
//                 </div>
//               </div>
//             )}

//             {/* PROPS DEFINITION STEP */}
//             {step === "props" && (
//               <div className="step-section">
//                 <h2 className="step-title">🎛️ Component Props</h2>
//                 <p className="step-description">Define props and their types</p>

//                 {formData.props.length > 0 && (
//                   <div className="props-list">
//                     <h3 className="props-heading">Defined Props</h3>
//                     <div className="props-items">
//                       {formData.props.map((prop, idx) => (
//                         <div key={idx} className="prop-item">
//                           <div className="prop-info">
//                             <div className="prop-name">{prop.label || prop.name}</div>
//                             <div className="prop-type">{prop.type}</div>
//                             {prop.default && (
//                               <div className="prop-default">default: {prop.default}</div>
//                             )}
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => removeProp(idx)}
//                             className="prop-delete-btn"
//                             title="Remove prop"
//                           >
//                             ✕
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="prop-form">
//                   <h3 className="prop-form-heading">Add New Prop</h3>
//                   <div className="form-group">
//                     <input
//                       type="text"
//                       placeholder="Prop name (e.g., title)"
//                       value={currentProp.name}
//                       onChange={(e) =>
//                         setCurrentProp(prev => ({ ...prev, name: e.target.value }))
//                       }
//                       className="form-input"
//                     />
//                   </div>

//                   <div className="form-group">
//                     <input
//                       type="text"
//                       placeholder="Display label (e.g., Title)"
//                       value={currentProp.label}
//                       onChange={(e) =>
//                         setCurrentProp(prev => ({ ...prev, label: e.target.value }))
//                       }
//                       className="form-input"
//                     />
//                   </div>

//                   <div className="form-group">
//                     <select
//                       value={currentProp.type}
//                       onChange={(e) =>
//                         setCurrentProp(prev => ({ ...prev, type: e.target.value }))
//                       }
//                       className="form-input"
//                     >
//                       <option value="text">Text</option>
//                       <option value="color">Color</option>
//                       <option value="number">Number</option>
//                       <option value="boolean">Boolean</option>
//                       <option value="select">Select</option>
//                       <option value="fontSize">Font Size</option>
//                       <option value="alignment">Text Alignment</option>
//                       <option value="spacing">Spacing</option>
//                       <option value="border">Border</option>
//                     </select>
//                   </div>

//                   <div className="form-group">
//                     <input
//                       type="text"
//                       placeholder="Default value"
//                       value={currentProp.default}
//                       onChange={(e) =>
//                         setCurrentProp(prev => ({ ...prev, default: e.target.value }))
//                       }
//                       className="form-input"
//                     />
//                   </div>

//                   <button
//                     type="button"
//                     onClick={addProp}
//                     className="btn btn-success"
//                   >
//                     + Add Prop
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* REVIEW STEP */}
//             {step === "review" && (
//               <div className="step-section">
//                 <h2 className="step-title">✅ Review Component</h2>
//                 <p className="step-description">Review your component before creating</p>

//                 <div className="review-grid">
//                   <div className="review-card">
//                     <div className="review-label">Component Name</div>
//                     <div className="review-value">{formData.name || "—"}</div>
//                   </div>

//                   <div className="review-card">
//                     <div className="review-label">Category</div>
//                     <div className="review-value">{formData.category || "—"}</div>
//                   </div>

//                   <div className="review-card">
//                     <div className="review-label">Props Count</div>
//                     <div className="review-value">{formData.props.length}</div>
//                   </div>

//                   <div className="review-card">
//                     <div className="review-label">Code Length</div>
//                     <div className="review-value">{formData.code.length} chars</div>
//                   </div>
//                 </div>

//                 <div className="review-section">
//                   <div className="review-heading">Description</div>
//                   <div className="review-text">{formData.description || "No description provided"}</div>
//                 </div>

//                 <div className="review-section">
//                   <div className="review-heading">Props ({formData.props.length})</div>
//                   {formData.props.length > 0 ? (
//                     <div className="review-props-list">
//                       {formData.props.map((prop, idx) => (
//                         <div key={idx} className="review-prop">
//                           <span className="review-prop-name">{prop.name}</span>
//                           <span className="review-prop-type">{prop.type}</span>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="review-text">No props defined</div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="action-buttons">
//               {step !== "basic" && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     const steps = ["basic", "code", "props", "review"];
//                     const currentIndex = steps.indexOf(step);
//                     if (currentIndex > 0) setStep(steps[currentIndex - 1]);
//                   }}
//                   className="btn btn-secondary"
//                 >
//                   ← Back
//                 </button>
//               )}

//               {step !== "review" && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     const steps = ["basic", "code", "props", "review"];
//                     const currentIndex = steps.indexOf(step);
//                     if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
//                   }}
//                   className="btn btn-primary"
//                 >
//                   Next →
//                 </button>
//               )}

//               {step === "review" && (
//                 <button
//                   type="submit"
//                   className="btn btn-success"
//                 >
//                   Create Component ✓
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>

//         {/* Status Bar */}
//         <div className="status-bar">
//           <div className="status-item">
//             {isSaved ? "✓ All changes saved" : "● Unsaved changes"}
//           </div>
//           <div className="status-item">
//             <span onClick={() => setShowShortcuts(!showShortcuts)} className="status-link">
//               Ctrl+K for shortcuts
//             </span>
//           </div>
//           <div className="status-item">
//             Step: <strong>{step.toUpperCase()}</strong>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import "./ComponentBuilder.css";

const defaultCode = `function ComponentPreview({ title = "Component title", description = "A live preview of your component." }) {
  return (
    <div style={{ padding: 24, borderRadius: 24, background: "#eff6ff", color: "#0f172a", border: "1px solid #c7d2fe" }}>
      <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
      <p style={{ margin: "12px 0 0", color: "#475569" }}>{description}</p>
    </div>
  );
}`;

const defaultPreviewCode = `${defaultCode}\n\nrender(<ComponentPreview />);`;

function getComponentName(code) {
  if (!code) return "ComponentPreview";
  const functionMatch = code.match(/function\s+([A-Za-z0-9_]+)/);
  const constMatch = code.match(/const\s+([A-Za-z0-9_]+)\s*=/);
  const arrowMatch = code.match(/([A-Za-z0-9_]+)\s*=\s*\(.*?\)\s*=>/);
  return (functionMatch?.[1] || constMatch?.[1] || arrowMatch?.[1] || "ComponentPreview");
}

function getPreviewCode(code) {
  const trimmed = code?.trim();
  if (!trimmed) return defaultPreviewCode;
  if (trimmed.includes("render(")) return trimmed;
  const name = getComponentName(trimmed);
  return `${trimmed}\n\nrender(<${name} />);`;
}

export default function ComponentBuilder({ token, onSuccess, initialData = null }) {
  const [step, setStep] = useState("basic");
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    category: "",
    description: "",
    code: defaultCode,
    installSteps: "",
    props: [],
  });

  const [currentProp, setCurrentProp] = useState({
    name: "", label: "", type: "text", default: "", options: [],
  });

  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedAssetToInject, setSelectedAssetToInject] = useState("");

  const isEditing = !!initialData;

  // Pre-fill form for editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        label: initialData.label || "",
        category: initialData.category || "",
        description: initialData.description || "",
        code: initialData.template || initialData.code || defaultCode,
        installSteps: initialData.installSteps || "",
        props: initialData.props || [],
      });
      setStep("code");
      setIsSaved(true);
    }
  }, [initialData]);

  // Cleanup previews
  useEffect(() => {
    return () => {
      selectedFiles.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [selectedFiles]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        setIsSaved(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && step === "review") {
        e.preventDefault();
        handleSubmit();
      }
      if (e.ctrlKey && e.key === "ArrowRight") {
        e.preventDefault();
        const steps = ["basic", "code", "props", "review"];
        const idx = steps.indexOf(step);
        if (idx < steps.length - 1) setStep(steps[idx + 1]);
      }
      if (e.ctrlKey && e.key === "ArrowLeft") {
        e.preventDefault();
        const steps = ["basic", "code", "props", "review"];
        const idx = steps.indexOf(step);
        if (idx > 0) setStep(steps[idx - 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleCodeChange = (code) => {
    setFormData((prev) => ({ ...prev, code }));
    extractPropsFromCode(code);
    setIsSaved(false);
  };

  const handleInjectAsset = () => {
    if (!selectedAssetToInject) return;
    const fileObj = selectedFiles[parseInt(selectedAssetToInject)];
    if (!fileObj) return;

    let injection = `"${fileObj.file.name}"`;
    if (fileObj.file.type.startsWith("image/")) {
      injection = `<img src="${fileObj.preview}" alt="${fileObj.file.name}" style={{ maxWidth: "100%", height: "auto" }} />`;
    }

    setFormData((prev) => ({
      ...prev,
      code: prev.code + `\n\n// Asset Injection:\n${injection}`,
    }));
    setIsSaved(false);
    setSelectedAssetToInject("");
  };

  const handleAIFix = async () => {
    try {
      setAiLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/admin/components/ai/fix",
        { code: formData.code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.code) {
        setFormData((prev) => ({ ...prev, code: res.data.code }));
        extractPropsFromCode(res.data.code);
        setIsSaved(false);
        alert("✅ AI Fixed the code successfully.");
      }
    } catch (err) {
      alert("AI Fix failed: " + (err.response?.data?.message || err.message));
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return alert("Please enter a prompt.");
    try {
      setAiLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/admin/components/ai/generate",
        { prompt: aiPrompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.code) {
        setFormData((prev) => ({ ...prev, code: res.data.code }));
        extractPropsFromCode(res.data.code);
        setIsSaved(false);
        setShowAIGenerator(false);
        setAiPrompt("");
        alert("✅ AI Generated component successfully.");
      }
    } catch (err) {
      alert("AI Generation failed: " + (err.response?.data?.message || err.message));
    } finally {
      setAiLoading(false);
    }
  };

  const extractPropsFromCode = (code) => {
    const match = code.match(/function\s+\w+\s*\(\s*\{\s*([^}]*)\s*\}\s*\)/);
    if (match) {
      const props = match[1]
        .split(",")
        .map((p) => p.trim().split("=")[0].trim())
        .filter(Boolean);

      const extracted = props.map((prop) => ({
        name: prop,
        label: prop.charAt(0).toUpperCase() + prop.slice(1),
        type: "text",
        default: "",
        options: [],
      }));

      setFormData((prev) => ({ ...prev, props: extracted }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const withPreview = files.map((f) => ({
      file: f,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
    }));
    setSelectedFiles((prev) => [...prev, ...withPreview]);
    setIsSaved(false);
  };

  const removeFile = (index) => {
    const toRemove = selectedFiles[index];
    if (toRemove?.preview) URL.revokeObjectURL(toRemove.preview);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setIsSaved(false);
  };

  const addProp = () => {
    if (!currentProp.name) return alert("Prop name is required");
    setFormData((prev) => ({
      ...prev,
      props: [...prev.props, { ...currentProp }],
    }));
    setCurrentProp({ name: "", label: "", type: "text", default: "", options: [] });
    setIsSaved(false);
  };

  const removeProp = (index) => {
    setFormData((prev) => ({
      ...prev,
      props: prev.props.filter((_, i) => i !== index),
    }));
    setIsSaved(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      const { name, label, category, description, code, installSteps, props } = formData;

      if (selectedFiles.length > 0) {
        const fd = new FormData();
        fd.append("name", name);
        fd.append("label", label);
        fd.append("type", "frontend");
        fd.append("category", category);
        fd.append("description", description);
        fd.append("template", code);
        fd.append("installSteps", installSteps);
        if (props?.length) fd.append("props", JSON.stringify(props));

        selectedFiles.forEach((f) => fd.append("files", f.file));

        const url = isEditing
          ? `http://localhost:5000/api/admin/component/${initialData._id}`
          : "http://localhost:5000/api/admin/component";

        await axios[isEditing ? "put" : "post"](url, fd, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        const payload = { name, label, category, description, template: code, installSteps, props };
        const url = isEditing
          ? `http://localhost:5000/api/admin/component/${initialData._id}`
          : "http://localhost:5000/api/admin/components/create";

        await axios[isEditing ? "put" : "post"](url, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      alert(isEditing ? "✅ Component updated successfully!" : "✅ Component created successfully!");

      if (!isEditing) {
        setFormData({
          name: "", label: "", category: "", description: "", code: defaultCode,
          installSteps: "", props: [],
        });
        setSelectedFiles([]);
        setStep("basic");
      }

      onSuccess?.();
    } catch (err) {
      alert("Error saving component: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="vscode-container">
      <div className="vscode-left">
        <div className="activity-bar">
          <div className="activity-icon active" title="Component Builder"><span>🔨</span></div>
          <div className="activity-icon" title="Settings"><span>⚙️</span></div>
          <div className="activity-icon" title="Help" onClick={() => setShowShortcuts(true)}><span>❓</span></div>
        </div>

        <div className="sidebar">
          <div className="sidebar-header">{isEditing ? "✏️ Edit Component" : "🚀 Component Builder"}</div>
          <nav className="steps-nav">
            {[
              { id: "basic", label: "Basic Info", icon: "📝" },
              { id: "code", label: "Code Editor", icon: "💻" },
              { id: "props", label: "Props Config", icon: "🎛️" },
              { id: "review", label: "Review & Save", icon: "✅" },
            ].map((s) => (
              <div
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`step-item ${step === s.id ? "active" : ""}`}
              >
                <span className="step-icon">{s.icon}</span>
                <span className="step-label">{s.label}</span>
                {step === s.id && <div className="active-indicator"></div>}
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="vscode-main">
        <div className="editor-tabs">
          <div className="tab active">
            <span>component.jsx</span>
            {!isSaved && <span className="unsaved-dot">●</span>}
          </div>
        </div>

        <div className="breadcrumb">
          Admin / Components / <span className="active">{step.toUpperCase()}</span>
        </div>

        {showShortcuts && (
          <div className="shortcuts-modal">
            <div className="shortcuts-content">
              <button className="close-btn" onClick={() => setShowShortcuts(false)}>✕</button>
              <h2>Keyboard Shortcuts</h2>
              <div className="shortcuts-list">
                <div className="shortcut-item"><span className="shortcut-key">Ctrl+K</span> Toggle Shortcuts</div>
                <div className="shortcut-item"><span className="shortcut-key">Ctrl+→</span> Next Step</div>
                <div className="shortcut-item"><span className="shortcut-key">Ctrl+←</span> Previous Step</div>
                <div className="shortcut-item"><span className="shortcut-key">Ctrl+Enter</span> Submit (Review)</div>
              </div>
            </div>
          </div>
        )}

        <div className="editor-content">
          <form onSubmit={handleSubmit} className="form-container">

            {/* STEP 1: BASIC */}
            {step === "basic" && (
              <div className="step-section">
                <h2 className="step-title">📝 Basic Information</h2>
                <div className="form-group">
                  <label>Component System Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleBasicChange} placeholder="e.g., CustomHeroCard" required />
                </div>
                <div className="form-group">
                  <label>Display UI Label *</label>
                  <input type="text" name="label" value={formData.label} onChange={handleBasicChange} placeholder="e.g., Hero Card Minimal" required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleBasicChange} required>
                    <option value="">Select Category</option>
                    <option value="Layout">Layout System</option>
                    <option value="Forms">Form Controller</option>
                    <option value="Navigation">Navigation Elements</option>
                    <option value="Cards">Display Cards</option>
                    <option value="Buttons">Action Interfaces</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>System Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleBasicChange} rows="3" required />
                </div>
                <div className="form-group">
                  <label>Asset Pipeline & Media Files</label>
                  <input type="file" multiple onChange={handleFileChange} />
                  {selectedFiles.length > 0 && (
                    <div className="asset-preview-grid">
                      {selectedFiles.map((f, idx) => (
                        <div key={idx} className="asset-preview-card">
                          {f.preview ? <img src={f.preview} alt="preview" /> : <div>📄 {f.file.name}</div>}
                          <button type="button" onClick={() => removeFile(idx)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: CODE EDITOR */}
            {step === "code" && (
              <div className="step-section">
                <h2 className="step-title">💻 Advanced Code Sandbox</h2>

                <div className="asset-injection-bar">
                  <label>Insert Uploaded Assets:</label>
                  <div className="flex gap-2">
                    <select value={selectedAssetToInject} onChange={(e) => setSelectedAssetToInject(e.target.value)}>
                      <option value="">-- Choose Asset --</option>
                      {selectedFiles.map((f, i) => (
                        <option key={i} value={i}>{f.file.name}</option>
                      ))}
                    </select>
                    <button type="button" onClick={handleInjectAsset} disabled={!selectedAssetToInject}>📥 Insert</button>
                  </div>
                </div>

                <LiveProvider code={getPreviewCode(formData.code)} scope={{ React }} noInline>
                  <div className="code-editor-grid">
                    <div className="editor-wrapper">
                      <div className="editor-header">
                        Workspace Editor
                        <div className="flex gap-2">
                          <button type="button" onClick={handleAIFix} disabled={aiLoading}>
                            {aiLoading ? "Fixing..." : "AI Debug"}
                          </button>
                          <button type="button" onClick={() => setShowAIGenerator(true)}>Prompt Engine</button>
                        </div>
                      </div>
                      <LiveEditor code={formData.code} onChange={handleCodeChange} />
                      <LiveError />
                    </div>
                    <div className="preview-wrapper">
                      <div className="preview-header">Live Preview</div>
                      <LivePreview />
                    </div>
                  </div>
                </LiveProvider>

                {showAIGenerator && (
                  <div className="ai-generator-modal">
                    <div className="ai-generator-card">
                      <h3>AI Component Generator</h3>
                      <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} rows={4} placeholder="Describe the component..." />
                      <div className="flex gap-2">
                        <button type="button" onClick={handleAIGenerate} disabled={aiLoading}>Generate</button>
                        <button type="button" onClick={() => setShowAIGenerator(false)}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: PROPS */}
            {step === "props" && (
              <div className="step-section">
                <h2 className="step-title">🎛️ Props Configuration</h2>
                <div className="props-list">
                  {formData.props.map((prop, idx) => (
                    <div key={idx} className="prop-item">
                      <strong>{prop.name}</strong> — {prop.type}
                      <button type="button" onClick={() => removeProp(idx)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="prop-form">
                  <h3>Add New Prop</h3>
                  <input
                    type="text"
                    placeholder="Prop name"
                    value={currentProp.name}
                    onChange={(e) => setCurrentProp((p) => ({ ...p, name: e.target.value }))}
                  />
                  <select
                    value={currentProp.type}
                    onChange={(e) => setCurrentProp((p) => ({ ...p, type: e.target.value }))}
                  >
                    <option value="text">Text</option>
                    <option value="color">Color</option>
                    <option value="boolean">Boolean</option>
                  </select>
                  <button type="button" onClick={addProp}>+ Add Prop</button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW */}
            {step === "review" && (
              <div className="step-section">
                <h2 className="step-title">✅ Review & Publish</h2>
                <div className="review-grid">
                  <div><strong>Name:</strong> {formData.name}</div>
                  <div><strong>Label:</strong> {formData.label}</div>
                  <div><strong>Category:</strong> {formData.category}</div>
                  <div><strong>Assets:</strong> {selectedFiles.length} files</div>
                  <div><strong>Props:</strong> {formData.props.length}</div>
                </div>
              </div>
            )}

            <div className="action-buttons">
              {step !== "basic" && (
                <button type="button" onClick={() => {
                  const steps = ["basic", "code", "props", "review"];
                  setStep(steps[steps.indexOf(step) - 1]);
                }} className="btn btn-secondary">
                  ← Back
                </button>
              )}

              {step !== "review" ? (
                <button type="button" onClick={() => {
                  const steps = ["basic", "code", "props", "review"];
                  setStep(steps[steps.indexOf(step) + 1]);
                }} className="btn btn-primary">
                  Next →
                </button>
              ) : (
                <button type="submit" className="btn btn-success">
                  {isEditing ? "Update Component" : "Publish Component"} ✓
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="status-bar">
          <div>{isSaved ? "● Ready" : "⚒ Unsaved changes"}</div>
          <div>Mode: <strong>{isEditing ? "EDIT" : "CREATE"}</strong></div>
        </div>
      </div>
    </div>
  );
}