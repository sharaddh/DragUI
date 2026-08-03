import API from "./index";

// EMAIL LOGIN
export const loginAPI = (data) =>
  API.post("/auth/login", data);

// EMAIL REGISTER
export const registerAPI = (data) =>
  API.post("/auth/register", data);

// GOOGLE LOGIN
export const googleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/user/google`;
};

// GITHUB LOGIN
export const githubLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
};