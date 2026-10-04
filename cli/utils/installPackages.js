import {
 execFileSync
}
from "child_process";

import {
 detectPackageManager
}
from "./packageManager.js";

const PACKAGE_NAME_PATTERN =
 /^[A-Za-z0-9@\/._^~*-]+$/;

const MANAGER_ARGS = {
 npm: ["install"],
 pnpm: ["add"],
 yarn: ["add"]
};

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

 const args =
  MANAGER_ARGS[manager];

 if(
  !args
 ){

  throw new Error(
   `Unsupported package manager: ${manager}`
  );

 }

 // execFileSync with an argument array avoids interpolating registry-supplied
 // package names into a shell string.
 execFileSync(
  manager,
  [
   ...args,
   ...packages
  ],
  {
   stdio:"inherit",
   shell:false
  }
 );

}