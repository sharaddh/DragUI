import React, { useState } from "react";
import axios from "axios";

export default function ComponentBuilder({ token, onSuccess }) {
  const [step, setStep] = useState("basic"); // basic, code, props, review
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    category: "",
    description: "",
    template: "", // path or template reference
    installSteps: "",
    props: [],
  });

  const [currentProp, setCurrentProp] = useState({
    name: "",
    label: "",
    type: "text", // text, color, select, number, boolean, alignment, fontSize
    default: "",
    options: [],
  });

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCodeChange = (e) => {
    // Remove handleCodeChange, not needed
  };

  const handleInstallChange = (e) => {
    setFormData(prev => ({ ...prev, installSteps: e.target.value }));
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
  };

  const removeProp = (index) => {
    setFormData(prev => ({
      ...prev,
      props: prev.props.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Only send allowed fields
      const { name, label, category, description, template, installSteps, props } = formData;
      const payload = { name, label, category, description, template, installSteps, props };
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
        template: "",
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
    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
      <h2 className="text-2xl font-bold mb-6">Create New Component</h2>

      <div className="flex gap-2 mb-6">
        {["basic", "code", "props", "review"].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              step === s
                ? "bg-cyan-500 text-white"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* BASIC INFO */}
        {step === "basic" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Component Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleBasicChange}
                placeholder="e.g., Card, Button, Hero"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Display Label</label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleBasicChange}
                placeholder="e.g., Card Component"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleBasicChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option>Select category</option>
                <option>Layout</option>
                <option>Typography</option>
                <option>Forms</option>
                <option>Navigation</option>
                <option>Cards</option>
                <option>Buttons</option>
                <option>Media</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleBasicChange}
                placeholder="Describe what this component does..."
                rows="4"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep("code")}
              className="w-full bg-cyan-500 text-white py-2 rounded-lg font-semibold hover:bg-cyan-600"
            >
              Continue to Code →
            </button>
          </div>
        )}

        {/* CODE EDITOR */}
        {step === "code" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Component Code (JSX)</label>
              <textarea
                value={formData.code}
                onChange={handleCodeChange}
                placeholder={`export default function ${formData.name || "MyComponent"}(props) {
  return <div>{props.children}</div>;
}`}
                rows="12"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Installation Steps (Optional)</label>
              <textarea
                value={formData.installSteps}
                onChange={handleInstallChange}
                placeholder="npm install tailwindcss
npm install @heroicons/react"
                rows="6"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep("basic")}
                className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-100"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep("props")}
                className="flex-1 bg-cyan-500 text-white py-2 rounded-lg font-semibold hover:bg-cyan-600"
              >
                Define Props →
              </button>
            </div>
          </div>
        )}

        {/* PROPS DEFINITION */}
        {step === "props" && (
          <div className="space-y-4">
            <h3 className="font-semibold">Component Props</h3>

            {formData.props.length > 0 && (
              <div className="space-y-2">
                {formData.props.map((prop, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-300 flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{prop.label || prop.name}</div>
                      <div className="text-xs text-slate-500">{prop.type}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProp(idx)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white p-4 rounded-lg border border-slate-300 space-y-3">
              <input
                type="text"
                placeholder="Prop name (e.g., title)"
                value={currentProp.name}
                onChange={(e) => setCurrentProp(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <input
                type="text"
                placeholder="Display label (e.g., Title)"
                value={currentProp.label}
                onChange={(e) => setCurrentProp(prev => ({ ...prev, label: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <select
                value={currentProp.type}
                onChange={(e) => setCurrentProp(prev => ({ ...prev, type: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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

              <input
                type="text"
                placeholder="Default value"
                value={currentProp.default}
                onChange={(e) => setCurrentProp(prev => ({ ...prev, default: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <button
                type="button"
                onClick={addProp}
                className="w-full bg-emerald-500 text-white py-2 rounded-lg font-semibold hover:bg-emerald-600"
              >
                + Add Prop
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep("code")}
                className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-100"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep("review")}
                className="flex-1 bg-cyan-500 text-white py-2 rounded-lg font-semibold hover:bg-cyan-600"
              >
                Review →
              </button>
            </div>
          </div>
        )}

        {/* REVIEW */}
        {step === "review" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg space-y-3">
              
              <div>
                <div className="text-xs text-slate-500 uppercase">Category</div>
                <div className="font-semibold">{formData.category}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">Props</div>
                <div className="font-semibold">{formData.props.length} props defined</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep("props")}
                className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-100"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-semibold hover:bg-emerald-600"
              >
                Create Component ✓
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
