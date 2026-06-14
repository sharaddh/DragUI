import fs from "fs";

export function detectFramework() {

 if (
  fs.existsSync(
   "next.config.js"
  ) ||
  fs.existsSync(
   "next.config.mjs"
  )
 ) {

  return "next";

 }

 if (
  fs.existsSync(
   "vite.config.js"
  ) ||
  fs.existsSync(
   "vite.config.ts"
  )
 ) {

  return "vite";

 }

 return "react";

}