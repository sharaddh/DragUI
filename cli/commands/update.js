import path from "path";

import ora from "ora";

import {
 getConfig
}
from "../utils/config.js";

import {
 readLockfile,
 addComponent
}
from "../utils/lockfile.js";

import backupFile
from "../utils/backup.js";

import writeFiles
from "../utils/fileWriter.js";

import {
 getManifest
}
from "../services/registry.js";

export default async function update(
 component
){

 const spinner =
  ora(
   "Checking updates..."
  ).start();

 try{

  const manifest =
   await getManifest(
    component
   );

  const lock =
   readLockfile();

  const installed =
   lock.components[
    component
   ];

  if(
   manifest.version &&
   installed ===
   manifest.version
  ){

   spinner.succeed(
    "Already up to date"
   );

   return;
  }

  const config =
   getConfig();

  backupFile(

   path.join(

    config.componentsDir,

    `${component}.jsx`

   )

  );

  await writeFiles(

   manifest.files,

   config.componentsDir

  );

  addComponent(

   manifest.name || component,

   manifest.version

  );

  spinner.succeed(
   `${manifest.name || component} updated`
  );

 }catch(error){

  process.exitCode = 1;

  spinner.fail(
   error.response?.data?.message || error.message
  );

 }

}