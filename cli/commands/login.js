import crypto from "crypto";
import http from "http";
import { exec } from "child_process";
import { platform } from "os";
import axios from "axios";

import { saveToken } from "../utils/auth.js";
import { API_BASE, CLIENT_URL } from "../utils/config.js";

const LOGIN_TIMEOUT_MS = 5 * 60 * 1000;

function openBrowser(url) {
  if (platform() === "win32") {
    exec(`start "" "${url}"`);
  } else if (platform() === "darwin") {
    exec(`open "${url}"`);
  } else {
    exec(`xdg-open "${url}"`);
  }
}

export default async function login() {
  const state = crypto.randomBytes(16).toString("hex");
  let loginTimer;

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");

    if (url.pathname !== "/callback") {
      res.writeHead(404);
      res.end();
      return;
    }

    if (url.searchParams.get("state") !== state) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end("<h2>DropUI CLI</h2><p>Invalid login state. Please try again.</p>");
      return;
    }

    const token = url.searchParams.get("token");

    if (!token) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end("<h2>DropUI CLI</h2><p>No token received. Please try again.</p>");
      return;
    }

    saveToken(token, "user");

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "<h2>&#10003; DropUI CLI</h2><p>Logged in successfully. You can close this window and return to your terminal.</p>"
    );

    let verified = true;

    // Confirm the token actually authenticates before declaring success
    try {
      const profile = await axios.get(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Logged in as ${profile.data.user?.email || "DropUI user"}`);
    } catch {
      verified = false;
      console.log("Logged in (could not verify profile) - the token may not be valid");
    }

    clearTimeout(loginTimer);
    server.close(() => process.exit(verified ? 0 : 1));
  });

  server.listen(0, "127.0.0.1", () => {
    const port = server.address().port;
    const redirect = `http://127.0.0.1:${port}/callback?state=${state}`;
    const url = `${CLIENT_URL}/cli-login?redirect=${encodeURIComponent(redirect)}`;

    console.log("Opening browser to complete login...");
    console.log("(If nothing opens, visit the URL below)");
    console.log("");
    console.log(url);

    openBrowser(url);
  });

  loginTimer = setTimeout(() => {
    console.log("Login timed out. Run 'dropui login' again to retry.");
    server.close();
    process.exit(1);
  }, LOGIN_TIMEOUT_MS);
}