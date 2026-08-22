import {
 execSync
}
from "child_process";

import {
 detectPackageManager
}
from "./packageManager.js";

const PACKAGE_NAME_PATTERN =
 /^[A-Za-z0-9@\/._-]+$/;

export default function installPackages(
 packages=[]
){

 if(
  !packages.length
 ){
  return;
 }

 packages.forEach(
  name=>{

   if(
    !PACKAGE_NAME_PATTERN.test(
     name
    )
   ){

    throw new Error(
     `Invalid package name: ${name}`
    );

   }

  }
 );

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
