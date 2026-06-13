import { getToken } from "../utils/config.js";

export default function whoami() {
  const token = getToken();

  if (!token) {
    console.log("❌ Not logged in");
    return;
  }

  console.log("✅ Logged in");
}