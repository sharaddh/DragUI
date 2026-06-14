import chalk from "chalk";

import {
 detectFramework
}
from "../utils/framework.js";

import {
 saveConfig
}
from "../utils/config.js";

export default async function init() {

 const config = {

  framework:
   detectFramework(),

  componentsDir:
   "src/components",

  registry:
   "default"

 };

 saveConfig(
  config
 );

 console.log(
  chalk.green(
   "✓ DropUI initialized"
  )
 );

}