import open from "open";
import http from "http";
import { saveToken } from "../utils/config.js";

export default async function login() {
  const PORT = 54321;

  // 🔥 Start local server
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const token = url.searchParams.get("token");

    if (token) {
      saveToken(token);

      res.end("✅ Login successful! You can close this tab.");
      console.log("✅ Logged in successfully");

      server.close();
    }
  });

  server.listen(PORT, () => {
    console.log("🌐 Opening browser for login...");

  const loginUrl = `http://localhost:5173/cli-login?redirect=http://localhost:${PORT}`;
open(loginUrl);
  });
}