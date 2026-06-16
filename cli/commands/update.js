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
 getManifest,
 getLatestVersion
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

  const lock =
   readLockfile();

  const installed =
   lock.components[
    component
   ];

  const latest =
   await getLatestVersion(
    component
   );

  if(
   installed ===
   latest.version
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

  const manifest =
   await getManifest(
    component
   );

  await writeFiles(

   manifest.manifest.files,

   config.componentsDir

  );

  addComponent(

   component,

   latest.version

  );

  spinner.succeed(

   `${component}
    updated`

  );

 }catch(error){

  spinner.fail(
   error.message
  );

 }

}