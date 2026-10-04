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

 const entry =
  lock.components[
   component
  ];

 if (
  !entry
 ) {
  console.error(chalk.red(`${component} is not installed`));
  process.exitCode = 1;
  return;
 }

 const config =
  getConfig();

 const root =
  path.resolve(
   config.componentsDir
  );

 const files =
  entry.files || [
   `${component}.jsx`
  ];

 for (
  const file
  of files
 ) {

  const target =
   path.resolve(
    config.componentsDir,
    file
   );

  if (
   target === root ||
   target.startsWith(
    root + path.sep
   )
  ) {
   if (
    fs.existsSync(target)
   ) {
    fs.unlinkSync(target);
   }
  }

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