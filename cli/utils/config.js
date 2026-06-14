import fs from "fs";

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