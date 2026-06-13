import api
from "../utils/api.js";

import {
 getDropUIConfig
}
from "../utils/config.js";

import {
 writeFiles
}
from "../utils/fileWriter.js";

import {
 installPackages
}
from "../utils/packageInstaller.js";

export default async function add(

 component

){

 const config =
 getDropUIConfig();

 const result =
 await api.get(

  `/registry/manifest/${component}`

 );

 const manifest =
  result.data.manifest;

 installPackages(

  manifest.dependencies

 );

 writeFiles(

  manifest.files,

  config.componentsDir

 );

 console.log(
  "Installed",
  component
 );

}