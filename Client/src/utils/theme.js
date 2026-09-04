export const DEFAULT_THEME = {
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

const VAR_MAP = {
  primary: "--du-primary",
  secondary: "--du-secondary",
  accent: "--du-accent",
  background: "--du-background",
  surface: "--du-surface",
  text: "--du-text",
  textMuted: "--du-text-muted",
  border: "--du-border",
  borderRadius: "--du-radius",
  fontFamily: "--du-font",
};

export function loadPersistedTheme() {
  try {
    const saved = localStorage.getItem("dropui-theme");
    return saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function applyDuTheme(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  Object.entries(VAR_MAP).forEach(([key, cssVar]) => {
    root.style.setProperty(cssVar, theme[key] || DEFAULT_THEME[key]);
  });
}