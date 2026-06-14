import ora from "ora";

import {
 getConfig
}
from "../utils/config.js";

import writeFiles
from "../utils/fileWriter.js";

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

 try {

  const config =
   getConfig();

  const manifest =
   await getManifest(
    component
   );

  await writeFiles(

   manifest.files,

   config.componentsDir

  );

  spinner.succeed(
   `${component} installed`
  );

 } catch(error){

  spinner.fail(
   error.message
  );

 }

}