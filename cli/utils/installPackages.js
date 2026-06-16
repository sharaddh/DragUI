import {
 execSync
}
from "child_process";

import {
 detectPackageManager
}
from "./packageManager.js";

export default function installPackages(
 packages=[]
){

 if(
  !packages.length
 ){
  return;
 }

 const manager =
  detectPackageManager();

 let command =
  "";

 if(
  manager === "npm"
 ){

  command =
   `npm install ${packages.join(" ")}`;

 }

 if(
  manager === "pnpm"
 ){

  command =
   `pnpm add ${packages.join(" ")}`;

 }

 if(
  manager === "yarn"
 ){

  command =
   `yarn add ${packages.join(" ")}`;

 }

 execSync(
  command,
  {
   stdio:"inherit"
  }
 );

}