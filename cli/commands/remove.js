import fs from "fs";
import path from "path";
import chalk from "chalk";

import {
 readLockfile,
 saveLockfile
}
from "../utils/lockfile.js";

import {
 getConfig
}
from "../utils/config.js";

export default function remove(
 component
){

 if (
  !component ||
  component.includes("/") ||
  component.includes("\\") ||
  component.includes("..")
 ) {
  console.error(chalk.red(`Invalid component name: ${component}`));
  process.exitCode = 1;
  return;
 }

 const lock =
  readLockfile();

 if (
  !(component in lock.components)
 ) {
  console.error(chalk.red(`${component} is not installed`));
  process.exitCode = 1;
  return;
 }

 const config =
  getConfig();

 const file =
  path.join(

   config.componentsDir,

   `${component}.jsx`

  );

 if(
  fs.existsSync(file)
 ){

  fs.unlinkSync(file);

 }

 delete lock.components[
  component
 ];

 saveLockfile(lock);

 console.log(
  chalk.green(
   `${component} removed`
  )
 );

}