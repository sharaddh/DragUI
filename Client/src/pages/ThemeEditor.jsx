import { useState, useEffect } from "react";
import { Palette, RotateCcw, Check, Copy } from "lucide-react";

const DEFAULT_THEME = {
  primary: "#06b6d4",
  secondary: "#8b5cf6",
  accent: "#f59e0b",
  background: "#ffffff",
  surface: "#f8fafc",
  text: "#0f172a",
  textMuted: "#64748b",
  border: "#e2e8f0",
  borderRadius: "12px",
  fontFamily: "Inter, system-ui, sans-serif",
};

export default function ThemeEditor() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("dropui-theme");
    return saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("colors");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (t) => {
    const root = document.documentElement;
    root.style.setProperty("--du-primary", t.primary);
    root.style.setProperty("--du-secondary", t.secondary);
    root.style.setProperty("--du-accent", t.accent);
    root.style.setProperty("--du-background", t.background);
    root.style.setProperty("--du-surface", t.surface);
    root.style.setProperty("--du-text", t.text);
    root.style.setProperty("--du-text-muted", t.textMuted);
    root.style.setProperty("--du-border", t.border);
    root.style.setProperty("--du-radius", t.borderRadius);
    root.style.setProperty("--du-font", t.fontFamily);
  };

  const saveTheme = () => {
    localStorage.setItem("dropui-theme", JSON.stringify(theme));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
    localStorage.removeItem("dropui-theme");
  };

  const updateColor = (key, value) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const colorGroups = [
    {
      label: "Brand Colors",
      keys: [
        { key: "primary", label: "Primary" },
        { key: "secondary", label: "Secondary" },
        { key: "accent", label: "Accent" },
      ],
    },
    {
      label: "Surface Colors",
      keys: [
        { key: "background", label: "Background" },
        { key: "surface", label: "Surface" },
        { key: "border", label: "Border" },
      ],
    },
    {
      label: "Text Colors",
      keys: [
        { key: "text", label: "Text" },
        { key: "textMuted", label: "Muted Text" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Theme Editor</h1>
          <p className="mt-1 text-slate-500">Customize your global UI theme</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetTheme}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={saveTheme}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
              saved
                ? "bg-emerald-500"
                : "bg-cyan-500 hover:bg-cyan-600"
            }`}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Palette className="h-4 w-4" />
                Save Theme
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
            {["colors", "typography", "code"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                  activeTab === tab
                    ? "bg-cyan-50 text-cyan-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "colors" && (
            <div className="space-y-6">
              {colorGroups.map((group) => (
                <div
                  key={group.label}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="mb-4 text-sm font-semibold text-slate-900">
                    {group.label}
                  </h3>
                  <div className="space-y-4">
                    {group.keys.map(({ key, label }) => (
                      <div key={key}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <label className="text-sm font-medium text-slate-700">
                            {label}
                          </label>
                          <span className="font-mono text-xs text-slate-400">
                            {theme[key]}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={theme[key]}
                            onChange={(e) => updateColor(key, e.target.value)}
                            className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-transparent"
                          />
                          <input
                            type="text"
                            value={theme[key]}
                            onChange={(e) => updateColor(key, e.target.value)}
                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "typography" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Typography
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Font Family
                    </label>
                    <input
                      type="text"
                      value={theme.fontFamily}
                      onChange={(e) => updateColor("fontFamily", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Border Radius
                    </label>
                    <input
                      type="text"
                      value={theme.borderRadius}
                      onChange={(e) => updateColor("borderRadius", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "code" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-slate-900">
                CSS Variables
              </h3>
              <p className="mb-4 text-sm text-slate-500">
                Copy these CSS variables to use in your own projects.
              </p>
              <div className="relative">
                <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-200">
                  <code>{`:root {
${Object.entries(theme)
  .map(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    return `  --du-${cssKey}: ${value};`;
  })
  .join("\n")}
}`}</code>
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `:root {\n${Object.entries(theme)
                        .map(([key, value]) => {
                          const cssKey = key
                            .replace(/([A-Z])/g, "-$1")
                            .toLowerCase();
                          return `  --du-${cssKey}: ${value};`;
                        })
                        .join("\n")}\n}`
                    );
                  }}
                  className="absolute right-3 top-3 rounded-lg bg-white/10 p-2 text-white/60 transition hover:bg-white/20 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Preview</h3>
            <div
              className="overflow-hidden rounded-2xl border"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                fontFamily: theme.fontFamily,
              }}
            >
              <div className="space-y-4 p-6">
                <div
                  className="rounded-xl px-4 py-3 text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  Primary Button
                </div>
                <div
                  className="rounded-xl px-4 py-3 text-white"
                  style={{ backgroundColor: theme.secondary }}
                >
                  Secondary Button
                </div>
                <div
                  className="rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                    borderWidth: 1,
                  }}
                >
                  <p style={{ color: theme.text }}>Sample card content</p>
                  <p className="mt-1 text-sm" style={{ color: theme.textMuted }}>
                    Muted description text
                  </p>
                </div>
                <div
                  className="rounded-xl px-4 py-2 text-center text-sm font-medium"
                  style={{
                    backgroundColor: theme.accent,
                    color: "#ffffff",
                  }}
                >
                  Accent Badge
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl border bg-white p-6 shadow-sm"
            style={{ borderColor: theme.border }}
          >
            <h3
              className="mb-4 text-sm font-semibold"
              style={{ color: theme.text }}
            >
              Live Preview
            </h3>
            <div
              className="rounded-xl border p-4"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                borderRadius: theme.borderRadius,
              }}
            >
              <input
                type="text"
                placeholder="Input field"
                className="mb-3 w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: theme.border,
                  color: theme.text,
                  borderRadius: theme.borderRadius,
                }}
              />
              <div className="flex gap-2">
                <button
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
                  style={{
                    backgroundColor: theme.primary,
                    borderRadius: theme.borderRadius,
                  }}
                >
                  Submit
                </button>
                <button
                  className="rounded-lg px-4 py-2 text-sm font-semibold"
                  style={{
                    borderColor: theme.border,
                    borderWidth: 1,
                    color: theme.text,
                    borderRadius: theme.borderRadius,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}