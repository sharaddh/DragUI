import { clearToken } from "../utils/config.js";

export default function logout() {
  clearToken();
  console.log("👋 Logged out");
}