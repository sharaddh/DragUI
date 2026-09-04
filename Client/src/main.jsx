import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/authContext.jsx";
import { loadPersistedTheme, applyDuTheme } from "./utils/theme";

const theme = loadPersistedTheme();
if (localStorage.getItem("dropui-dark") === "true") {
  applyDuTheme({
    ...theme,
    background: "#0f172a",
    surface: "#1e293b",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    border: "#334155",
  });
} else {
  applyDuTheme(theme);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);