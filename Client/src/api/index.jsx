import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 🔥 AUTO ADD TOKEN
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Expired/invalid tokens should never leave the app in a broken state -
// clear the stale token and send the user back to the login screen,
// remembering where they were so they can be returned after re-login.
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith("/login")) {
      const current = window.location.pathname + window.location.search;
      if (current !== "/") sessionStorage.setItem("dropui.returnTo", current);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;