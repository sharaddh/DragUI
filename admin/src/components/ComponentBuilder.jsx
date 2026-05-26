import React, { useState, useEffect, useRef } from "react";
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
  const functionMatch = code.match(/function\s+([A-Za-z0-9_]+)/);
  const constMatch = code.match(/const\s+([A-Za-z0-9_]+)\s*=\s*/);
  const arrowMatch = code.match(/([A-Za-z0-9_]+)\s*=\s*\(.*\)\s*=>/);
  return (functionMatch || constMatch || arrowMatch)?.[1] || "ComponentPreview";
}

function getPreviewCode(code) {
  const trimmed = code?.trim();
  if (!trimmed) return defaultPreviewCode;
  if (trimmed.includes("render(")) return trimmed;
  const name = getComponentName(trimmed);
  return `${trimmed}\n\nrender(<${name} />);`;
}

export default function ComponentBuilder({ token, onSuccess }) {
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
    name: "",
    label: "",
    type: "text",
    default: "",
    options: [],
  });

  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        setIsSaved(true);
      }
      // Ctrl/Cmd + K - Show shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
      // Ctrl/Cmd + Enter - Submit
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (step === "review") {
          handleSubmit();
        }
      }
      // Arrow keys to navigate steps
      if (e.key === "ArrowRight" && e.ctrlKey) {
        e.preventDefault();
        const steps = ["basic", "code", "props", "review"];
        const currentIndex = steps.indexOf(step);
        if (currentIndex < steps.length - 1) {
          setStep(steps[currentIndex + 1]);
        }
      }
      if (e.key === "ArrowLeft" && e.ctrlKey) {
        e.preventDefault();
        const steps = ["basic", "code", "props", "review"];
        const currentIndex = steps.indexOf(step);
        if (currentIndex > 0) {
          setStep(steps[currentIndex - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, showShortcuts]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleCodeChange = (code) => {
    setFormData(prev => ({ ...prev, code }));
    extractPropsFromCode(code);
    setIsSaved(false);
  };

  const extractPropsFromCode = (code) => {
    // Simple regex to find props in function signature
    const match = code.match(/function\s+\w+\s*\(\s*\{\s*([^}]*)\s*\}\s*\)/);
    if (match) {
      const propsStr = match[1];
      const props = propsStr.split(',').map(p => p.trim()).filter(p => p);
      const extractedProps = props.map(prop => ({
        name: prop,
        label: prop.charAt(0).toUpperCase() + prop.slice(1),
        type: "text",
        default: "",
        options: [],
      }));
      setFormData(prev => ({ ...prev, props: extractedProps }));
    }
  };

  const handleInstallChange = (e) => {
    setFormData(prev => ({ ...prev, installSteps: e.target.value }));
    setIsSaved(false);
  };

  const addProp = () => {
    if (!currentProp.name) {
      alert("Prop name is required");
      return;
    }

    setFormData(prev => ({
      ...prev,
      props: [...prev.props, { ...currentProp }],
    }));

    setCurrentProp({
      name: "",
      label: "",
      type: "text",
      default: "",
      options: [],
    });
    setIsSaved(false);
  };

  const removeProp = (index) => {
    setFormData(prev => ({
      ...prev,
      props: prev.props.filter((_, i) => i !== index),
    }));
    setIsSaved(false);
  };

  const handleSubmit = async () => {

    try {
      // Only send allowed fields
      const { name, label, category, description, code, installSteps, props } = formData;
      const payload = { name, label, category, description, template: code, installSteps, props };
      const response = await axios.post(
        "http://localhost:5000/api/admin/components/create",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Component created successfully!");
      setFormData({
        name: "",
        label: "",
        category: "",
        description: "",
        code: defaultCode,
        installSteps: "",
        props: [],
      });
      setStep("basic");
      onSuccess?.();
    } catch (err) {
      alert("Error creating component: " + err.message);
    }
  };

  return (
    <div className="vscode-container">
      {/* Activity Bar & Sidebar */}
      <div className="vscode-left">
        <div className="activity-bar">
          <div className="activity-icon active" title="Component Builder">
            <span>🔨</span>
          </div>
          <div className="activity-icon" title="Settings">
            <span>⚙️</span>
          </div>
          <div className="activity-icon" title="Help">
            <span>❓</span>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-header">Component Builder</div>
          <nav className="steps-nav">
            {[
              { id: "basic", label: "Basic Info", icon: "📝" },
              { id: "code", label: "Code Editor", icon: "💻" },
              { id: "props", label: "Props", icon: "🎛️" },
              { id: "review", label: "Review", icon: "✅" },
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

      {/* Main Editor Area */}
      <div className="vscode-main">
        {/* Editor Tabs */}
        <div className="editor-tabs">
          <div className="tab active">
            <span>⚪ component.jsx</span>
            {!isSaved && <span className="unsaved-dot">●</span>}
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span className="breadcrumb-item">Admin</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item">Components</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">{step.toUpperCase()}</span>
        </div>

        {/* Shortcuts Modal */}
        {showShortcuts && (
          <div className="shortcuts-modal">
            <div className="shortcuts-content">
              <button
                className="close-btn"
                onClick={() => setShowShortcuts(false)}
              >
                ✕
              </button>
              <h2>Keyboard Shortcuts</h2>
              <div className="shortcuts-list">
                <div className="shortcut-item">
                  <span className="shortcut-key">Ctrl+K</span>
                  <span className="shortcut-desc">Toggle Shortcuts</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-key">Ctrl+→</span>
                  <span className="shortcut-desc">Next Step</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-key">Ctrl+←</span>
                  <span className="shortcut-desc">Previous Step</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-key">Ctrl+Enter</span>
                  <span className="shortcut-desc">Submit</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-key">Ctrl+S</span>
                  <span className="shortcut-desc">Mark as Saved</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="editor-content">
          <form onSubmit={handleSubmit} className="form-container">
            {/* BASIC INFO STEP */}
            {step === "basic" && (
              <div className="step-section">
                <h2 className="step-title">📝 Basic Information</h2>
                <p className="step-description">Define your component's basic details</p>

                <div className="form-group">
                  <label className="form-label">
                    Component Name
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleBasicChange}
                    placeholder="e.g., Card, Button, Hero"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Display Label
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleBasicChange}
                    placeholder="e.g., Card Component"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Category
                    <span className="required">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleBasicChange}
                    className="form-input"
                  >
                    <option value="">Select category</option>
                    <option value="Layout">Layout</option>
                    <option value="Typography">Typography</option>
                    <option value="Forms">Forms</option>
                    <option value="Navigation">Navigation</option>
                    <option value="Cards">Cards</option>
                    <option value="Buttons">Buttons</option>
                    <option value="Media">Media</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Description
                    <span className="required">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleBasicChange}
                    placeholder="Describe what this component does..."
                    rows="4"
                    className="form-input"
                  ></textarea>
                </div>
              </div>
            )}

            {/* CODE EDITOR STEP */}
            {step === "code" && (
              <div className="step-section">
                <h2 className="step-title">💻 Component Code</h2>
                <p className="step-description">Write your JSX component with live preview</p>

                <LiveProvider code={getPreviewCode(formData.code)} scope={{ React }} noInline>
                  <div className="code-editor-grid">
                    <div className="editor-wrapper">
                      <div className="editor-header">
                        <span className="editor-label">Editor</span>
                        <span className="file-name">component.jsx</span>
                      </div>
                      <LiveEditor
                        code={formData.code}
                        onChange={handleCodeChange}
                        className="live-editor"
                        style={{ minHeight: "400px" }}
                      />
                      <LiveError className="editor-error" />
                    </div>

                    <div className="preview-wrapper">
                      <div className="preview-header">
                        <span className="preview-label">Live Preview</span>
                      </div>
                      <div className="preview-render">
                        <LivePreview />
                      </div>
                    </div>
                  </div>
                </LiveProvider>

                <div className="form-group" style={{ marginTop: "20px" }}>
                  <label className="form-label">Installation Steps (Optional)</label>
                  <textarea
                    value={formData.installSteps}
                    onChange={handleInstallChange}
                    placeholder="npm install tailwindcss&#10;npm install @heroicons/react"
                    rows="5"
                    className="form-input"
                  ></textarea>
                </div>
              </div>
            )}

            {/* PROPS DEFINITION STEP */}
            {step === "props" && (
              <div className="step-section">
                <h2 className="step-title">🎛️ Component Props</h2>
                <p className="step-description">Define props and their types</p>

                {formData.props.length > 0 && (
                  <div className="props-list">
                    <h3 className="props-heading">Defined Props</h3>
                    <div className="props-items">
                      {formData.props.map((prop, idx) => (
                        <div key={idx} className="prop-item">
                          <div className="prop-info">
                            <div className="prop-name">{prop.label || prop.name}</div>
                            <div className="prop-type">{prop.type}</div>
                            {prop.default && (
                              <div className="prop-default">default: {prop.default}</div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProp(idx)}
                            className="prop-delete-btn"
                            title="Remove prop"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="prop-form">
                  <h3 className="prop-form-heading">Add New Prop</h3>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Prop name (e.g., title)"
                      value={currentProp.name}
                      onChange={(e) =>
                        setCurrentProp(prev => ({ ...prev, name: e.target.value }))
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Display label (e.g., Title)"
                      value={currentProp.label}
                      onChange={(e) =>
                        setCurrentProp(prev => ({ ...prev, label: e.target.value }))
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <select
                      value={currentProp.type}
                      onChange={(e) =>
                        setCurrentProp(prev => ({ ...prev, type: e.target.value }))
                      }
                      className="form-input"
                    >
                      <option value="text">Text</option>
                      <option value="color">Color</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="select">Select</option>
                      <option value="fontSize">Font Size</option>
                      <option value="alignment">Text Alignment</option>
                      <option value="spacing">Spacing</option>
                      <option value="border">Border</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Default value"
                      value={currentProp.default}
                      onChange={(e) =>
                        setCurrentProp(prev => ({ ...prev, default: e.target.value }))
                      }
                      className="form-input"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addProp}
                    className="btn btn-success"
                  >
                    + Add Prop
                  </button>
                </div>
              </div>
            )}

            {/* REVIEW STEP */}
            {step === "review" && (
              <div className="step-section">
                <h2 className="step-title">✅ Review Component</h2>
                <p className="step-description">Review your component before creating</p>

                <div className="review-grid">
                  <div className="review-card">
                    <div className="review-label">Component Name</div>
                    <div className="review-value">{formData.name || "—"}</div>
                  </div>

                  <div className="review-card">
                    <div className="review-label">Category</div>
                    <div className="review-value">{formData.category || "—"}</div>
                  </div>

                  <div className="review-card">
                    <div className="review-label">Props Count</div>
                    <div className="review-value">{formData.props.length}</div>
                  </div>

                  <div className="review-card">
                    <div className="review-label">Code Length</div>
                    <div className="review-value">{formData.code.length} chars</div>
                  </div>
                </div>

                <div className="review-section">
                  <div className="review-heading">Description</div>
                  <div className="review-text">{formData.description || "No description provided"}</div>
                </div>

                <div className="review-section">
                  <div className="review-heading">Props ({formData.props.length})</div>
                  {formData.props.length > 0 ? (
                    <div className="review-props-list">
                      {formData.props.map((prop, idx) => (
                        <div key={idx} className="review-prop">
                          <span className="review-prop-name">{prop.name}</span>
                          <span className="review-prop-type">{prop.type}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="review-text">No props defined</div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              {step !== "basic" && (
                <button
                  type="button"
                  onClick={() => {
                    const steps = ["basic", "code", "props", "review"];
                    const currentIndex = steps.indexOf(step);
                    if (currentIndex > 0) setStep(steps[currentIndex - 1]);
                  }}
                  className="btn btn-secondary"
                >
                  ← Back
                </button>
              )}

              {step !== "review" && (
                <button
                  type="button"
                  onClick={() => {
                    const steps = ["basic", "code", "props", "review"];
                    const currentIndex = steps.indexOf(step);
                    if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
                  }}
                  className="btn btn-primary"
                >
                  Next →
                </button>
              )}

              {step === "review" && (
                <button
                  type="submit"
                  className="btn btn-success"
                >
                  Create Component ✓
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-item">
            {isSaved ? "✓ All changes saved" : "● Unsaved changes"}
          </div>
          <div className="status-item">
            <span onClick={() => setShowShortcuts(!showShortcuts)} className="status-link">
              Ctrl+K for shortcuts
            </span>
          </div>
          <div className="status-item">
            Step: <strong>{step.toUpperCase()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
