import fetch from "node-fetch";
import { getToken } from "./config.js";

const BASE_URL = "http://localhost:5000/api";

export async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const error = await res.json();
      throw new Error(error.error || error.message || `HTTP ${res.status}`);
    } else {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
  }

  return res.json();
}