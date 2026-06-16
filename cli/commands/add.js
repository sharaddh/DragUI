import ora from "ora";

import {
 getConfig
}
from "../utils/config.js";

import writeFiles
from "../utils/fileWriter.js";

import installPackages
from "../utils/installPackages.js";

import {
 addComponent
}
from "../utils/lockfile.js";

import {
 getManifest
}
from "../services/registry.js";

export default async function add(
 component
){

 const spinner =
  ora(
   "Installing..."
  ).start();

 try{

  const config =
   getConfig();

  const data =
   await getManifest(
    component
   );

  const manifest =
   data.manifest;

  installPackages(

   manifest.dependencies
   || []

  );

  await writeFiles(

   manifest.files,

   config.componentsDir

  );

  addComponent(

   manifest.name,

   manifest.version

  );

  spinner.succeed(

   `${manifest.name}
    installed`

  );

 }catch(error){

  spinner.fail(
   error.message
  );

 }

} 