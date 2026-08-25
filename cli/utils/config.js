import fs from "fs";

// Central CLI configuration - single place to change environments.
export const API_BASE =
  process.env.DROPUI_API_URL || "http://localhost:5000/api";

export const CLIENT_URL =
  process.env.DROPUI_CLIENT_URL || "http://localhost:5173";

const CONFIG =
 "dropui.config.json";

export function getConfig() {

 if (
  !fs.existsSync(CONFIG)
 ) {

  throw new Error(
   "Run dropui init first"
  );

 }

 return JSON.parse(
  fs.readFileSync(
   CONFIG,
   "utf8"
  )
 );

}

export function saveConfig(
 config
) {

 fs.writeFileSync(
  CONFIG,
  JSON.stringify(
   config,
   null,
   2
  )
 );

}
