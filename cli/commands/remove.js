import fs from "fs";
import path from "path";

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

 const lock =
  readLockfile();

 delete lock.components[
  component
 ];

 saveLockfile(lock);

 console.log(
  `${component} removed`
 );

}