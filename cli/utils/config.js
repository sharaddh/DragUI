import fs from "fs";
import os from "os";
import path from "path";

const configPath = path.join(os.homedir(), ".dropui.json");

export function saveToken(token) {
  fs.writeFileSync(configPath, JSON.stringify({ token }));
}

export function getToken() {
  if (!fs.existsSync(configPath)) return null;

  const data = JSON.parse(fs.readFileSync(configPath));
  return data.token;
}

export function clearToken() {
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
}