// Central CLI configuration - single place to change environments.
export const API_BASE =
  process.env.DROPUI_API_URL || "http://localhost:5000/api";

export const CLIENT_URL =
  process.env.DROPUI_CLIENT_URL || "http://localhost:5173";
