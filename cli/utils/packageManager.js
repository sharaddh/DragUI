import fs from "fs";

export function detectPackageManager(){

 if(
  fs.existsSync(
   "pnpm-lock.yaml"
  )
 ){

  return "pnpm";

 }

 if(
  fs.existsSync(
   "yarn.lock"
  )
 ){

  return "yarn";

 }

 return "npm";

}